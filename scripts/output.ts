#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there

// ./scripts/output.ts PROJECT_NAME-SOME_BRANCH_NAME CloudFrontUrl
import {
  CloudFormationClient,
  DescribeStacksCommand,
} from "@aws-sdk/client-cloudformation";

const stackName = process.argv[2];
const outputKey = process.argv[3];

const client = new CloudFormationClient({ region: "us-east-1" });
const command = new DescribeStacksCommand({ StackName: stackName });
const response = await client.send(command);

const stack = response.Stacks?.[0];
const output = stack?.Outputs?.find((o) => o.OutputKey === outputKey);
console.log(output!.OutputValue); // eslint-disable-line no-console
