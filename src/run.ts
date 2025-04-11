import yargs from "yargs";
import * as dotenv from "dotenv";
import LabeledProcessRunner from "./runner.js";
import { ServerlessStageDestroyer } from "@stratiformdigital/serverless-stage-destroyer";
import { execSync } from "child_process";
import { addSlsBucketPolicies } from "./slsV4BucketPolicies.js";

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
      `Installing Dependencies`,
      ["yarn", "install", "--frozen-lockfile"],
      `services/${service}`
    );
  }
}

async function deploy(options: { stage: string }) {
  const runner = new LabeledProcessRunner();
  await install_deps_for_services(runner);
  var deployCmd = ["sls", "deploy", "--stage", options.stage];
  await runner.run_command_and_output(`SLS Deploy`, deployCmd, ".");
  await addSlsBucketPolicies();
}

async function destroy_stage(options: {
  stage: string;
  service: string | undefined;
  wait: boolean;
  verify: boolean;
}) {
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

  await destroyer.destroy(`${process.env.REGION_A}`, options.stage, {
    wait: options.wait,
    filters: filters,
    verify: options.verify,
  });

  await delete_topics(options);
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

/*
 * The command definitions in yargs
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
    () => {
      updateEnvFiles();
    }
  )
  .scriptName("run")
  .strict()
  .demandCommand(1, "").argv; // this prints out the help if you don't call a subcommand
