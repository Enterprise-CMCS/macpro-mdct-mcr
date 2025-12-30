// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { getCloudFormationStackOutputValues } from "./utils.ts";
import { project, region } from "./consts.ts";

export const seedData = async () => {
  const SeedDataFunctionName = (
    await getCloudFormationStackOutputValues(`${project}-localstack`)
  )["SeedDataFunctionName"];

  if (SeedDataFunctionName) {
    const lambdaClient = new LambdaClient({ region });
    const lambdaCommand = new InvokeCommand({
      FunctionName: SeedDataFunctionName,
      InvocationType: "Event",
      Payload: Buffer.from(JSON.stringify({})),
    });
    await lambdaClient.send(lambdaCommand);
  }
};
