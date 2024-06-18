import yargs from "yargs";
import * as dotenv from "dotenv";
import LabeledProcessRunner from "./runner.js";
import { ServerlessStageDestroyer } from "@stratiformdigital/serverless-stage-destroyer";
import { execSync } from "child_process";

// load .env
dotenv.config();

// run_db_locally runs the local db
async function run_db_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "db yarn",
    ["yarn", "install"],
    "services/database"
  );
  await runner.run_command_and_output(
    "db svls doc",
    ["serverless", "doctor"],
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
    "api svls doc",
    ["serverless", "doctor"],
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

// run_s3_locally runs s3 locally
async function run_s3_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "s3 yarn",
    ["yarn", "install"],
    "services/uploads"
  );
  runner.run_command_and_output(
    "s3 svls doc",
    ["serverless", "doctor"],
    "services/uploads"
  );
  runner.run_command_and_output(
    "s3",
    ["serverless", "s3", "start", "--stage", "local"],
    "services/uploads"
  );
}

// run_fe_locally runs the frontend and its dependencies locally
async function run_fe_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "ui deps",
    ["yarn", "install"],
    "services/ui-src"
  );
  runner.run_command_and_output(
    "ui svls doc",
    ["serverless", "doctor"],
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
  run_s3_locally(runner);
  run_api_locally(runner);
  run_fe_locally(runner);
}

async function destroy_stage(options: {
  stage: string;
  service: string | undefined;
  wait: boolean;
  verify: boolean;
}) {
  let destroyer = new ServerlessStageDestroyer();
  /*
   * Filters enable filtering by resource tags but we aren't leveraging any tags other than
   * the STAGE tag automatically applied by the serverless framework.  Adding PROJECT and SERVICE
   * tags would be a good idea.
   */
  await destroyer.destroy(`${process.env.REGION_A}`, options.stage, {
    wait: options.wait,
    filters: [],
    verify: options.verify,
  });
}

// Function to update .env files using 1Password CLI
function updateEnvFiles() {
  try {
    execSync("op inject -i .env.tpl -o .env -f", { stdio: "inherit" });
    execSync(
      "op inject -i services/ui-src/.env.tpl -o services/ui-src/.env -f",
      { stdio: "inherit" }
    );
  } catch (error) {
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
  .command("local", "run system locally", {}, () => {
    run_all_locally();
  })
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
