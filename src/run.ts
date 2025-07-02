/* eslint-disable multiline-comment-style */
/* eslint-disable no-console */
import yargs from "yargs";
import * as dotenv from "dotenv";
import LabeledProcessRunner from "./runner.js";
// import { ServerlessStageDestroyer } from "@stratiformdigital/serverless-stage-destroyer";
import { ServerlessStageDestroyer } from "./serverless-stage-destroyer.js";
import {
  getAllStacksForStage,
  getCloudFormationTemplatesForStage,
} from "./getCloudFormationTemplateForStage.js";
import { execSync } from "child_process";
import { addSlsBucketPolicies } from "./slsV4BucketPolicies.js";
import {
  CloudFormationClient,
  DescribeStackResourceCommand,
} from "@aws-sdk/client-cloudformation";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

// load .env
dotenv.config();

const deployedServices = [
  "database",
  "topics",
  "app-api",
  "ui",
  "ui-auth",
  "ui-src",
];

// Function to update .env files using 1Password CLI
function updateEnvFiles() {
  try {
    execSync("op inject -i .env.tpl -o .env -f", { stdio: "inherit" });
    execSync(
      "op inject -i services/ui-src/.env.tpl -o services/ui-src/.env -f",
      { stdio: "inherit" }
    );
    execSync("sed -i '' -e 's/# pragma: allowlist secret//g' .env");
    execSync(
      "sed -i '' -e 's/# pragma: allowlist secret//g' services/ui-src/.env"
    );
  } catch {
    // eslint-disable-next-line no-console
    console.error("Failed to update .env files using 1Password CLI.");
    process.exit(1);
  }
}

// run_db_locally runs the local db
async function run_db_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "db yarn",
    ["yarn", "install"],
    "services/database"
  );
  await runner.run_command_and_output(
    "db svls",
    ["serverless", "dynamodb", "install", "--stage", "local"],
    "services/database"
  );
  runner.run_command_and_output(
    "db",
    [
      "serverless",
      "offline",
      "start",
      "--stage",
      "local",
      "--lambdaPort",
      "3003",
    ],
    "services/database"
  );
}

// run_api_locally uses the serverless-offline plugin to run the api lambdas locally
async function run_api_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "api deps",
    ["yarn", "install"],
    "services/app-api"
  );
  runner.run_command_and_output(
    "api",
    [
      "serverless",
      "offline",
      "start",
      "--stage",
      "local",
      "--region",
      "us-east-1",
      "--httpPort",
      "3030",
    ],
    "services/app-api"
  );
}

// run_fe_locally runs the frontend and its dependencies locally
async function run_fe_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "ui deps",
    ["yarn", "install"],
    "services/ui-src"
  );
  await runner.run_command_and_output(
    "ui conf",
    ["./scripts/configure-env.sh", "local"],
    "services/ui-src"
  );

  runner.run_command_and_output("ui", ["npm", "start"], "services/ui-src");
}

// run_all_locally runs all of our services locally
async function run_all_locally() {
  const runner = new LabeledProcessRunner();

  run_db_locally(runner);
  run_api_locally(runner);
  run_fe_locally(runner);
}

async function install_deps_for_services(runner: LabeledProcessRunner) {
  for (const service of deployedServices) {
    await runner.run_command_and_output(
      "Installing Dependencies",
      ["yarn", "install", "--frozen-lockfile"],
      `services/${service}`
    );
  }
}

async function deploy(options: { stage: string }) {
  checkEnvVars();
  const runner = new LabeledProcessRunner();
  await install_deps_for_services(runner);
  const deployCmd = ["sls", "deploy", "--stage", options.stage];
  await runner.run_command_and_output("SLS Deploy", deployCmd, ".");
  await addSlsBucketPolicies();
}

async function checkRetainedResources(
  stage: string,
  filters: { Key: string; Value: string }[] | undefined
) {
  const cfnClient = new CloudFormationClient({ region: process.env.REGION_A });

  const templates = await getCloudFormationTemplatesForStage(
    `${process.env.REGION_A}`,
    stage,
    filters
  );

  const resourcesToCheck = {
    [`database-${stage}`]: [
      "BannerTable",
      "FormTemplateVersionsTable",
      "SarReportTable",
      "SarFormBucket",
      "WpReportTable",
      "WpFormBucket",
    ],
    [`ui-${stage}`]: [
      "CloudFrontDistribution",
      "LoggingBucket",
      "WaflogsUploadBucket",
    ],
    [`ui-auth-${stage}`]: ["CognitoUserPool"],
  };

  const notRetained: { templateKey: string; resourceKey: string }[] = [];
  const retained: {
    templateKey: string;
    resourceKey: string;
    physicalResourceId: string;
  }[] = [];

  for (const [templateKey, resourceKeys] of Object.entries(resourcesToCheck)) {
    for (const resourceKey of resourceKeys) {
      const policy =
        templates?.[templateKey]?.Resources?.[resourceKey]?.DeletionPolicy;
      if (policy === "Retain") {
        const describeCmd = new DescribeStackResourceCommand({
          StackName: templateKey,
          LogicalResourceId: resourceKey,
        });
        const response = await cfnClient.send(describeCmd);
        const physicalResourceId =
          response.StackResourceDetail!.PhysicalResourceId!;
        retained.push({ templateKey, resourceKey, physicalResourceId });
      } else {
        notRetained.push({ templateKey, resourceKey });
      }
    }
  }

  return { retained, notRetained };
}

function checkEnvVars() {
  const envVarsToCheck = [
    "LOGGING_BUCKET",
    "WP_FORM_BUCKET",
    "SAR_FORM_BUCKET",
    "WP_REPORT_TABLE_STREAM_ARN",
    "SAR_REPORT_TABLE_STREAM_ARN",
    "VPC_ID",
    "VPC_SUBNET_A",
    "VPC_SUBNET_B",
    "VPC_SUBNET_C",
    "BROKER_STRINGS",
  ];

  const setVars = envVarsToCheck.filter(
    (name) => process.env[name] !== undefined
  );

  if (setVars.length > 0) {
    const message = `Will not proceed because these environment variables are set:\n${setVars.join(
      ", "
    )}\ncheck your .env file`;

    throw message;
  }
}

async function destroy_stage(options: {
  stage: string;
  service: string | undefined;
  wait: boolean;
  verify: boolean;
}) {
  checkEnvVars();

  let destroyer = new ServerlessStageDestroyer();
  let filters = [
    {
      Key: "PROJECT",
      Value: `${process.env.PROJECT}`,
    },
  ];
  if (options.service) {
    filters.push({
      Key: "SERVICE",
      Value: `${options.service}`,
    });
  }

  const stacks = await getAllStacksForStage(
    `${process.env.REGION_A}`,
    options.stage,
    filters
  );

  const protectedStacks = stacks
    .filter((i: any) => i.EnableTerminationProtection)
    .map((i: any) => i.StackName);

  if (protectedStacks.length > 0) {
    console.log(
      `We cannot proceed with the destroy because the following stacks have termination protection enabled:\n${protectedStacks.join(
        "\n"
      )}`
    );
    return;
  } else {
    console.log(
      "No stacks have termination protection enabled. Proceeding with the destroy."
    );
  }

  let notRetained: { templateKey: string; resourceKey: string }[] = [];
  let retained;
  if (["main", "master", "val", "production"].includes(options.stage)) {
    ({ retained, notRetained } = await checkRetainedResources(
      options.stage,
      filters
    ));
  }

  if (retained) {
    console.log("Information to use for import to CDK:");
    retained.forEach(({ templateKey, resourceKey, physicalResourceId }) => {
      // WaflogsUploadBucket is being retained but not being imported into CDK.
      if (resourceKey !== "WaflogsUploadBucket") {
        console.log(`${templateKey} - ${resourceKey} - ${physicalResourceId}`);
      }
    });
  }

  if (notRetained.length > 0) {
    console.log(
      "Will not destroy the stage because it's an important stage and some important resources are not yet set to be retained:"
    );
    notRetained.forEach(({ templateKey, resourceKey }) =>
      console.log(` - ${templateKey}/${resourceKey}`)
    );
    return;
  }

  const accountId = await getAccountId();
  await destroyer.destroy(`${process.env.REGION_A}`, options.stage, {
    wait: options.wait,
    filters: filters,
    verify: options.verify,
    bucketsToSkip: [
      `database-${options.stage}-sar`,
      `database-${options.stage}-wp`,
      `ui-${options.stage}-cloudfront-logs-${accountId}`,
      `${accountId}-ui-${options.stage}-waflogs`,
    ],
  });

  // await delete_topics(options);
}

async function getAccountId() {
  const client = new STSClient({ region: process.env.REGION_A });
  const identity = await client.send(new GetCallerIdentityCommand({}));
  return identity.Account;
}

async function delete_topics(options: { stage: string }) {
  const runner = new LabeledProcessRunner();
  await install_deps_for_services(runner);
  let data = { project: "mcr", stage: options.stage };
  const deployCmd = [
    "sls",
    "invoke",
    "--stage",
    "main",
    "--function",
    "deleteTopics",
    "--data",
    JSON.stringify(data),
  ];
  await runner.run_command_and_output(
    "Remove topics",
    deployCmd,
    "services/topics"
  );
}

async function list_topics(options: { stage: string | undefined }) {
  const runner = new LabeledProcessRunner();
  await install_deps_for_services(runner);
  let data = { stage: options.stage };
  const deployCmd = [
    "sls",
    "invoke",
    "--stage",
    "main",
    "--function",
    "listTopics",
    "--data",
    JSON.stringify(data),
  ];
  await runner.run_command_and_output(
    "List topics",
    deployCmd,
    "services/topics"
  );
}

/*
 * The command definitons in yargs
 * All valid arguments to dev should be enumerated here, this is the entrypoint to the script
 */
yargs(process.argv.slice(2))
  .command("local", "run system locally", {}, run_all_locally)
  .command(
    "test",
    "run all tests",
    () => {},
    () => {
      // eslint-disable-next-line no-console
      console.log("Testing 1. 2. 3.");
    }
  )
  .command(
    "deploy",
    "deploy the app with serverless compose to the cloud",
    {
      stage: { type: "string", demandOption: true },
    },
    deploy
  )
  .command(
    "destroy",
    "destroy serverless stage",
    {
      stage: { type: "string", demandOption: true },
      service: { type: "string", demandOption: false },
      wait: { type: "boolean", demandOption: false, default: true },
      verify: { type: "boolean", demandOption: false, default: true },
    },
    destroy_stage
  )
  .command(
    "delete-topics",
    "delete topics tied to serverless stage",
    {
      stage: { type: "string", demandOption: true },
    },
    delete_topics
  )
  .command(
    "list-topics",
    "list topics for the project or for the stage",
    {
      stage: { type: "string", demandOption: false },
    },
    list_topics
  )
  .command(
    "update-env",
    "update environment variables using 1Password",
    () => {},
    updateEnvFiles
  )
  .scriptName("run")
  .strict()
  .demandCommand(1, "").argv; // this prints out the help if you don't call a subcommand