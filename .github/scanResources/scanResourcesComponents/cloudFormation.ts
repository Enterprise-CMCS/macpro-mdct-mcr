#!/usr/bin/env -S tsx
import {
  CloudFormationClient,
  paginateListStacks,
  paginateListStackResources,
  StackStatus,
  StackSummary,
} from "@aws-sdk/client-cloudformation";

const client = new CloudFormationClient({ region: "us-east-1" });

async function getAllStacks(): Promise<StackSummary[]> {
  const stacks: StackSummary[] = [];

  for await (const page of paginateListStacks(
    { client },
    {
      StackStatusFilter: Object.values(StackStatus).filter(
        (s) => s !== StackStatus.DELETE_COMPLETE
      ),
    }
  )) {
    stacks.push(...page.StackSummaries!);
  }

  return stacks;
}

async function getSelectedCfResourceIds(): Promise<Record<string, string[]>> {
  const interestedTypes = [
    "AWS::ApiGateway::RestApi",
    "AWS::CloudFront::CachePolicy",
    "AWS::CloudFront::Distribution",
    "AWS::CloudFront::OriginAccessControl",
    "AWS::CloudFront::ResponseHeadersPolicy",
    "AWS::Cognito::IdentityPool",
    "AWS::Cognito::UserPool",
    "AWS::DynamoDB::Table",
    "AWS::EC2::NetworkInterface",
    "AWS::EC2::SecurityGroup",
    "AWS::Events::Rule",
    "AWS::IAM::ManagedPolicy",
    "AWS::IAM::Policy",
    "AWS::IAM::Role",
    "AWS::KMS::Alias",
    "AWS::KMS::Key",
    "AWS::Lambda::Function",
    "AWS::Lambda::LayerVersion",
    "AWS::Logs::LogGroup",
    "AWS::S3::Bucket",
    "AWS::WAFv2::WebACL",
  ];

  const stacks = await getAllStacks();
  const result: Record<string, string[]> = {};

  for (const stack of stacks) {
    const stackName = stack.StackName!;

    for await (const page of paginateListStackResources(
      { client },
      { StackName: stackName }
    )) {
      for (const r of page.StackResourceSummaries!) {
        const type = r.ResourceType;
        if (!type || !interestedTypes.includes(type)) continue;
        if (!r.PhysicalResourceId) continue;
        (result[type] ||= []).push(r.PhysicalResourceId);
      }
    }
  }

  return result;
}

async function getDeleteFailedStacks(): Promise<string[]> {
  const stacks: string[] = [];

  for await (const page of paginateListStacks(
    { client },
    {
      StackStatusFilter: [StackStatus.DELETE_FAILED],
    }
  )) {
    if (page.StackSummaries) {
      stacks.push(...page.StackSummaries.map((s) => s.StackName!));
    }
  }

  return stacks;
}

function generateDeleteCommands(resources: string[]): string[] {
  return resources.map(
    (stackName) =>
      `aws cloudformation delete-stack --stack-name "${stackName}" --region us-east-1`
  );
}

export default {
  getAllStacks,
  getSelectedCfResourceIds,
  getDeleteFailedStacks,
  generateDeleteCommands,
};

if (import.meta.url === `file://${process.argv[1]}`) {
  getSelectedCfResourceIds().then((x) => console.log(x));
}
