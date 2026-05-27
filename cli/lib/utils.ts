import fs from "node:fs";
import dotenv from "dotenv";
import {
  CloudFormationClient,
  DescribeStacksCommand,
} from "@aws-sdk/client-cloudformation";
import { writeLocalUiEnvFile } from "./write-ui-env-file.ts";
import { runCommand } from "../lib/runner.ts";
import { project, region } from "./consts.ts";
import { writeSeedEnvFile } from "./write-seed-env-file.ts";

export const getCloudFormationStackOutputValues = async (
  stackName: string
): Promise<Record<string, string>> => {
  const cloudFormationClient = new CloudFormationClient({
    region,
  });
  const command = new DescribeStacksCommand({ StackName: stackName });
  const response = await cloudFormationClient.send(command);

  const outputs = response.Stacks?.[0]?.Outputs ?? [];
  return Object.fromEntries(
    outputs
      .map(
        (o) => [o.OutputKey ?? (o as any).OutputName, o.OutputValue] as const
      )
      .filter(([k]) => Boolean(k)) as [string, string][]
  );
};

const buildUiEnvObject = (
  stage: string,
  cfnOutputs: Record<string, string>
): Record<string, string> => {
  if (stage === "localstack") {
    const escapeDoubleQuotes = (value: string) => {
      return value.replaceAll('"', String.raw`\"`);
    };

    function checkLocalFlagsFormat(value?: string) {
      const defaultValue = '{"local": false, "flags": {}}';
      if (!value) return defaultValue;

      try {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed);
      } catch {
        console.error(
          "Invalid local flags format. Soft failing to empty flags."
        );
        return defaultValue;
      }
    }

    return {
      SKIP_PREFLIGHT_CHECK: "true",
      API_REGION: region,
      API_URL: cfnOutputs.ApiUrl.replace("https", "http"),
      COGNITO_REGION: region,
      COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID!,
      COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID!,
      COGNITO_USER_POOL_CLIENT_ID: process.env.COGNITO_USER_POOL_CLIENT_ID!,
      COGNITO_USER_POOL_CLIENT_DOMAIN:
        process.env.COGNITO_USER_POOL_CLIENT_DOMAIN!,
      COGNITO_IDP_NAME: "Okta",
      COGNITO_REDIRECT_SIGNIN: "http://localhost:3000/",
      COGNITO_REDIRECT_SIGNOUT: "http://localhost:3000/postLogout",
      POST_SIGNOUT_REDIRECT: "http://localhost:3000/",
      REACT_APP_LD_SDK_CLIENT: process.env.REACT_APP_LD_SDK_CLIENT!,
      LD_LOCAL_FLAGS: escapeDoubleQuotes(
        checkLocalFlagsFormat(process.env.LD_LOCAL_FLAGS)
      ),
      LD_SDK_KEY: process.env.LD_SDK_KEY!,
      STAGE: "local",
    };
  }

  return {
    SKIP_PREFLIGHT_CHECK: "true",
    API_REGION: region,
    API_URL: cfnOutputs.ApiUrl,
    COGNITO_REGION: region,
    COGNITO_IDENTITY_POOL_ID: cfnOutputs.CognitoIdentityPoolId,
    COGNITO_USER_POOL_ID: cfnOutputs.CognitoUserPoolId,
    COGNITO_USER_POOL_CLIENT_ID: cfnOutputs.CognitoUserPoolClientId,
    COGNITO_USER_POOL_CLIENT_DOMAIN: `${cfnOutputs.CognitoUserPoolClientDomain}.auth.${region}.amazoncognito.com`,
    COGNITO_IDP_NAME: "Okta",
    COGNITO_REDIRECT_SIGNIN: cfnOutputs.CloudFrontUrl,
    COGNITO_REDIRECT_SIGNOUT: cfnOutputs.CloudFrontUrl,
    POST_SIGNOUT_REDIRECT: cfnOutputs.CloudFrontUrl,
    REACT_APP_LD_SDK_CLIENT: process.env.REACT_APP_LD_SDK_CLIENT!,
    STAGE: stage,
  };
};

const buildEnvFiles = async (stage: string) => {
  dotenv.config({ override: true });

  const outputs = await getCloudFormationStackOutputValues(
    `${project}-${stage}`
  );
  const envVars = buildUiEnvObject(stage, outputs);
  await writeLocalUiEnvFile(envVars);
  await writeSeedEnvFile(envVars);
};

const watchLocalEnv = (stage: string) => {
  let timeout: NodeJS.Timeout | null = null;

  function updateEnvFiles() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      await buildEnvFiles(stage);
    }, 100);
  }
  updateEnvFiles();

  fs.watch(".env", updateEnvFiles);
};

export const runFrontendLocally = async (stage: string) => {
  watchLocalEnv(stage);
  runCommand("ui", ["yarn", "start"], "services/ui-src");
};
