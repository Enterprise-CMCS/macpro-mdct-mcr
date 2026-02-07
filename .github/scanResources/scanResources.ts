#!/usr/bin/env -S tsx
import fs from "node:fs";
import apiGateway from "./scanResourcesComponents/apiGateway";
import cloudFormation from "./scanResourcesComponents/cloudFormation";
import cloudFrontDistribution from "./scanResourcesComponents/cloudFrontDistribution";
import s3Buckets from "./scanResourcesComponents/s3Buckets";
import cloudFrontResponseHeadersPolicy from "./scanResourcesComponents/cloudFrontResponseHeadersPolicy";
import cloudFrontOriginAccessControl from "./scanResourcesComponents/cloudFrontOriginAccessControl";
import cloudFrontCachePolicy from "./scanResourcesComponents/cloudFrontCachePolicy";
import cloudWatchLogs from "./scanResourcesComponents/cloudWatchLogs";
import lambdaFunction from "./scanResourcesComponents/lambdaFunction";
import dynamoDb from "./scanResourcesComponents/dynamoDb";
import iamRole from "./scanResourcesComponents/iamRole";
import lambdaLayers from "./scanResourcesComponents/lambdaLayers";
import cognitoUserPool from "./scanResourcesComponents/cognitoUserPool";
import cognitoIdentityPool from "./scanResourcesComponents/cognitoIdentityPool";
import wafWebACL from "./scanResourcesComponents/wafWebACL";
import eventsRule from "./scanResourcesComponents/eventsRule";
import kmsKey from "./scanResourcesComponents/kmsKey";
import securityGroup from "./scanResourcesComponents/securityGroup";
import eni from "./scanResourcesComponents/eni";
import {
  APIGatewayClient,
  GetStagesCommand,
} from "@aws-sdk/client-api-gateway";
import { getAccountIdentifier, getAccountId } from "./utils";
import { getOrphanedStacks } from "./auditCloudFormationStacksAgainstGitBranches";

const apigw = new APIGatewayClient({ region: "us-east-1" });

let outputFile = "unmanaged-resources.txt";

type ResourceDeleteGenerator = (resources: string[]) => string[];
const unmanagedResources: {
  [resourceType: string]: {
    resources: string[];
    generator: ResourceDeleteGenerator;
  };
} = {};

function log(line: string = "") {
  console.log(line);
  fs.appendFileSync(outputFile, line + "\n");
}

function header(
  label: string,
  total: number,
  managed: number,
  additionalExcludes?: { [key: string]: number }
) {
  log(`${label} (total: ${total})`);
  log(`Managed by CloudFormation: ${managed}`);
  if (additionalExcludes) {
    for (const [reason, count] of Object.entries(additionalExcludes)) {
      if (count > 0) log(`Excluded for ${reason}: ${count}`);
    }
  }
}

function listUnmanaged(items: string[]) {
  if (items.length === 0) {
    log("✅ All are managed by CloudFormation or excluded.\n");
  } else {
    log("❌ Unmanaged:");
    for (const it of items) log(`- ${it}`);
    log();
  }
}

interface CheckGenericOptions {
  label: string;
  all: string[];
  cfManaged: string[];
  excludePrefixes?: { [key: string]: number };
  excludeExact?: { [key: string]: number };
  excludeContains?: { [key: string]: number };
  deleteGenerator?: ResourceDeleteGenerator;
}

async function checkGeneric(options: CheckGenericOptions) {
  const {
    label,
    all,
    cfManaged,
    excludePrefixes = {},
    excludeExact = {},
    excludeContains = {},
    deleteGenerator,
  } = options;

  const excludePrefixKeys = Object.keys(excludePrefixes);
  const excludeExactKeys = Object.keys(excludeExact);
  const excludeContainsKeys = Object.keys(excludeContains);

  let managedCount = 0;
  const unmanaged: string[] = [];

  for (const id of all) {
    if (cfManaged.includes(id)) {
      managedCount++;
      continue;
    }

    const excludedByPrefix = excludePrefixKeys.some((p) =>
      p ? id.startsWith(p) : false
    );

    const excludedByExact =
      excludeExactKeys.length > 0 && excludeExactKeys.includes(id);

    const excludedByContains = excludeContainsKeys.some((s) =>
      s ? id.includes(s) : false
    );

    if (!(excludedByPrefix || excludedByExact || excludedByContains)) {
      unmanaged.push(id);
    }
  }

  // Store unmanaged resources for CLI delete command generation
  if (deleteGenerator && unmanaged.length > 0) {
    unmanagedResources[label] = {
      resources: unmanaged,
      generator: deleteGenerator,
    };
  }

  const combinedCounts = {
    ...excludePrefixes,
    ...excludeExact,
    ...excludeContains,
  };

  header(label, all.length, managedCount, combinedCounts);
  listUnmanaged(unmanaged);
}

async function apiGatewayLogGroups(getArray: (k: string) => string[]) {
  const restApiIds = getArray("AWS::ApiGateway::RestApi");
  const apiGatewayLogGroups: string[] = [];
  for (const restApiId of restApiIds) {
    try {
      const stages = await apigw.send(new GetStagesCommand({ restApiId }));
      for (const s of stages.item!) {
        if (!s.stageName) continue;
        apiGatewayLogGroups.push(
          `API-Gateway-Execution-Logs_${restApiId}/${s.stageName}`
        );
      }
    } catch {} // eslint-disable-line no-empty
  }
  return apiGatewayLogGroups;
}

function generateDeleteCommands() {
  const deleteScriptFile = outputFile.replace(".txt", "-delete-commands.txt");
  const commands: string[] = [];

  commands.push("# AWS CLI commands to delete unmanaged resources");
  commands.push("# Generated: " + new Date().toISOString());
  commands.push("");
  commands.push("⚠️  IMPORTANT SAFETY WARNINGS:");
  commands.push(
    "1. MANUALLY VERIFY each resource before running its delete command"
  );
  commands.push(
    "2. Run commands INDIVIDUALLY, one at a time - DO NOT run all at once"
  );
  commands.push(
    "3. Confirm each resource is truly unmanaged and safe to delete"
  );
  commands.push("4. Remove the '#' prefix from each command before executing");
  commands.push("");

  for (const [resourceType, { resources, generator }] of Object.entries(
    unmanagedResources
  )) {
    if (resources.length === 0) continue;

    commands.push(`# Delete ${resourceType} (${resources.length} resources)`);
    // Prefix each AWS command with # to prevent bulk execution
    commands.push(...generator(resources).map((cmd) => `# ${cmd}`));
    commands.push("");
  }

  // Only create file if there are actual delete commands
  const hasAwsCommands = commands.some((cmd) => cmd.trim().startsWith("# aws"));
  if (hasAwsCommands) {
    fs.writeFileSync(deleteScriptFile, commands.join("\n"));
    log(`\nAWS CLI delete commands written to: ${deleteScriptFile}`);
    log(
      "⚠️ WARNING: Manually verify each resource and run commands individually!"
    );
  }
}

async function main() {
  const accountIdent = await getAccountIdentifier();
  const accountId = await getAccountId();
  outputFile = `unmanaged-resources-${accountIdent}.txt`;
  fs.writeFileSync(outputFile, "");
  console.log(`Writing scan results to ${outputFile}`);

  const deleteFailedStacks = await cloudFormation.getDeleteFailedStacks();
  if (deleteFailedStacks.length > 0) {
    log("CloudFormation Stacks in DELETE_FAILED State");
    log(`Found ${deleteFailedStacks.length} stack(s) in DELETE_FAILED state:`);
    for (const stackName of deleteFailedStacks) {
      log(`❌ ${stackName}`);
    }
    log();

    // Store DELETE_FAILED stacks for delete command generation
    unmanagedResources["CloudFormation Stacks (DELETE_FAILED)"] = {
      resources: deleteFailedStacks,
      generator: cloudFormation.generateDeleteCommands,
    };
  } else {
    log("CloudFormation Stacks in DELETE_FAILED State");
    log("✅ No stacks in DELETE_FAILED state.\n");
  }

  // Check for orphaned stacks (auto-detects in GitHub Actions or uses CLI arg)
  let repoName = process.argv[2];
  if (!repoName && process.env.GITHUB_REPOSITORY) {
    // Extract repo name from GITHUB_REPOSITORY (format: "owner/repo")
    repoName = process.env.GITHUB_REPOSITORY.split("/")[1];
  }
  if (repoName) {
    try {
      console.log(`Checking for orphaned stacks in repo: ${repoName}`);
      const orphanedStacks = await getOrphanedStacks(repoName);

      const orphanedStackPrefixes = [
        "CMS-Cloud",
        "cloudtamer",
        "ct-",
        "Trend-Micro",
        "CPM",
        "cms",
        "security-hub-collector",
      ];
      const orphanedStackExact = [
        "ConsolidatedPermissionBoundaryCFT",
        "CDKToolkit",
        "cbj-delete-snapshot",
        "smtp-ado-postfix-relay",
        "Wiz-Integration-Role",
      ];

      const projects = ["seds", "qmr", "mcr", "mfp", "hcbs", "carts"];
      for (const project of projects) {
        orphanedStackExact.push(`${project}-prerequisites`);
      }

      const orphanedStackNames = orphanedStacks.map((s) => s.name);
      const orphanedStackPrefixCounts: { [k: string]: number } = {};
      for (const prefix of orphanedStackPrefixes) {
        orphanedStackPrefixCounts[prefix] = orphanedStackNames.filter((n) =>
          n.startsWith(prefix)
        ).length;
      }

      const orphanedStackExactCounts: { [k: string]: number } = {};
      for (const exact of orphanedStackExact) {
        orphanedStackExactCounts[exact] = orphanedStackNames.filter(
          (n) => n === exact
        ).length;
      }

      await checkGeneric({
        label: `CloudFormation Orphaned Stacks (No Matching Git Branch in ${repoName})`,
        all: orphanedStackNames,
        cfManaged: [],
        excludePrefixes: orphanedStackPrefixCounts,
        excludeExact: orphanedStackExactCounts,
        deleteGenerator: cloudFormation.generateDeleteCommands,
      });
    } catch (e: any) {
      log(`⚠️ Failed to check orphaned stacks: ${e?.message || e}\n`);
    }
  }

  const cf = await cloudFormation.getSelectedCfResourceIds();
  const getArray = (k: string) => cf[k] || [];

  await checkGeneric({
    label: "API Gateway REST APIs",
    all: await apiGateway.getAllRestApis(),
    cfManaged: getArray("AWS::ApiGateway::RestApi"),
    deleteGenerator: apiGateway.generateDeleteCommands,
  });

  await checkGeneric({
    label: "CloudFront Distributions",
    all: await cloudFrontDistribution.getAllDistributions(),
    cfManaged: getArray("AWS::CloudFront::Distribution"),
    deleteGenerator: cloudFrontDistribution.generateDeleteCommands,
  });

  await checkGeneric({
    label: "CloudFront Custom Response Headers Policies",
    all: await cloudFrontResponseHeadersPolicy.getAllCustomResponseHeadersPolicies(),
    cfManaged: getArray("AWS::CloudFront::ResponseHeadersPolicy"),
    deleteGenerator: cloudFrontResponseHeadersPolicy.generateDeleteCommands,
  });

  await checkGeneric({
    label: "CloudFront Custom Cache Policies",
    all: await cloudFrontCachePolicy.getAllCustomCachePolicies(),
    cfManaged: getArray("AWS::CloudFront::CachePolicy"),
    deleteGenerator: cloudFrontCachePolicy.generateDeleteCommands,
  });

  await checkGeneric({
    label: "CloudFront Origin Access Controls",
    all: await cloudFrontOriginAccessControl.getAllOriginAccessControls(),
    cfManaged: getArray("AWS::CloudFront::OriginAccessControl"),
    deleteGenerator: cloudFrontOriginAccessControl.generateDeleteCommands,
  });

  const allS3Buckets = await s3Buckets.getAllS3Buckets();
  const s3SubstringExcludes: string[] = [
    "prod",
    "us-west-2",
    "main",
    "master",
    ...(accountId ? [accountId] : []),
  ];
  const s3ContainsCounts: { [k: string]: number } = {};
  for (const sub of s3SubstringExcludes) {
    s3ContainsCounts[sub] = allS3Buckets.filter((b) => b.includes(sub)).length;
  }
  await checkGeneric({
    label: "S3 Buckets",
    all: allS3Buckets,
    cfManaged: getArray("AWS::S3::Bucket"),
    excludeContains: s3ContainsCounts,
    deleteGenerator: undefined, // s3Buckets.generateDeleteCommands // commented out for now to avoid accidentally deleting data
  });

  const allLogGroups = await cloudWatchLogs.getAllLogGroups();
  const treatedAsManagedLogGroups: string[] = [
    ...getArray("AWS::Logs::LogGroup"),
    ...getArray("AWS::Lambda::Function").map(
      (functionName) => `/aws/lambda/${functionName}`
    ),
    ...(await apiGatewayLogGroups(getArray)),
  ];

  const logGroupExcludedPrefixes = [
    "/aws/ec2",
    "/aws/rds",
    "/aws/lambda/CMS-Cloud",
    "/aws/lambda/cms-cloud",
    "/aws/lambda/NewRelicInfrastructure-Integrations-LambdaFunction",
  ];

  const logGroupExactExcludes = [
    "/aws/ssm/CMS-Cloud-Security-RunInspec",
    "amazon-ssm-agent.log",
    "cms-cloud-vpc-querylogs",
    "/aws/apigateway/welcome",
    "/aws/lambda/CF-Custom-Resource-SSM-Association",
    "/aws/lambda/CMS-Custom-Resource-Placeholder-Document",
    "/aws/lambda/ITOPS-Security-Attach-Inspector-to-SNS",
    "/aws-dynamodb/imports",
  ];

  const logGroupContainsExcludes = ["main"];

  const cwAdditionalExcludePrefixes: { [k: string]: number } = {};
  for (const prefix of logGroupExcludedPrefixes) {
    cwAdditionalExcludePrefixes[prefix] = allLogGroups.filter((n) =>
      n.startsWith(prefix)
    ).length;
  }

  const cwAdditionalExactExcludes: { [k: string]: number } = {};
  for (const exact of logGroupExactExcludes) {
    cwAdditionalExactExcludes[exact] = allLogGroups.filter(
      (n) => n === exact
    ).length;
  }

  const cwAdditionalContainsExcludes: { [k: string]: number } = {};
  for (const substring of logGroupContainsExcludes) {
    cwAdditionalContainsExcludes[substring] = allLogGroups.filter((n) =>
      n.includes(substring)
    ).length;
  }

  await checkGeneric({
    label: "CloudWatch Log Groups",
    all: allLogGroups,
    cfManaged: treatedAsManagedLogGroups,
    excludePrefixes: cwAdditionalExcludePrefixes,
    excludeExact: cwAdditionalExactExcludes,
    excludeContains: cwAdditionalContainsExcludes,
    deleteGenerator: cloudWatchLogs.generateDeleteCommands,
  });

  await checkGeneric({
    label: "Lambda Functions",
    all: await lambdaFunction.getAllLambdaFunctions(),
    cfManaged: getArray("AWS::Lambda::Function"),
    deleteGenerator: lambdaFunction.generateDeleteCommands,
  });

  await checkGeneric({
    label: "Lambda LayerVersions",
    all: await lambdaLayers.getAllLayerVersionArns(),
    cfManaged: getArray("AWS::Lambda::LayerVersion"),
    deleteGenerator: lambdaLayers.generateDeleteCommands,
  });

  const allDynamoDbTables = await dynamoDb.getAllTableNames();
  const dynamoDbContainsExcludes = ["main"];
  const dynamoDbAdditionalContainsExcludes: { [k: string]: number } = {};
  for (const substring of dynamoDbContainsExcludes) {
    dynamoDbAdditionalContainsExcludes[substring] = allDynamoDbTables.filter(
      (n) => n.includes(substring)
    ).length;
  }

  await checkGeneric({
    label: "DynamoDB Tables",
    all: allDynamoDbTables,
    cfManaged: getArray("AWS::DynamoDB::Table"),
    excludeContains: dynamoDbAdditionalContainsExcludes,
    deleteGenerator: dynamoDb.generateDeleteCommands,
  });

  const allIamRoles = await iamRole.getAllIamRoles();
  log("All IAM Roles: " + allIamRoles.length);
  const projectRolePattern = /^(seds|qmr|mcr|mfp|hcbs|carts)/i;
  const projectIamRoles = allIamRoles.filter((name) =>
    projectRolePattern.test(name)
  );
  await checkGeneric({
    label: "IAM Roles (project-scoped, excluding service-linked)",
    all: projectIamRoles,
    cfManaged: getArray("AWS::IAM::Role"),
    deleteGenerator: iamRole.generateDeleteCommands,
  });

  await checkGeneric({
    label: "Cognito User Pools",
    all: await cognitoUserPool.getAllUserPools(),
    cfManaged: getArray("AWS::Cognito::UserPool"),
    deleteGenerator: cognitoUserPool.generateDeleteCommands,
  });

  await checkGeneric({
    label: "Cognito Identity Pools",
    all: await cognitoIdentityPool.getAllIdentityPools(),
    cfManaged: getArray("AWS::Cognito::IdentityPool"),
    deleteGenerator: cognitoIdentityPool.generateDeleteCommands,
  });

  const allWebAcls = await wafWebACL.getAllWafv2WebACLsCfnIds();
  const webAclExcludedPrefixes = ["FMManagedWebACLV2-cms-cloud"];

  const wafAdditionalExcludes: { [k: string]: number } = {};
  for (const prefix of webAclExcludedPrefixes) {
    wafAdditionalExcludes[prefix] = allWebAcls.filter((a) =>
      a.startsWith(prefix)
    ).length;
  }

  await checkGeneric({
    label: "WAFv2 WebACLs (REGIONAL & CLOUDFRONT)",
    all: allWebAcls,
    cfManaged: getArray("AWS::WAFv2::WebACL"),
    excludePrefixes: wafAdditionalExcludes,
    deleteGenerator: wafWebACL.generateDeleteCommands,
  });

  const allEventRules = await eventsRule.getAllEventRules();
  const eventRulesExcludedPrefixes = [
    "SSMExplorerManagedRule",
    "billing-alerts",
    "health-events",
    "custodian",
    "DO-NOT-DELETE",
    "CMS-Cloud",
    "cms-cloud",
    "Tenable",
  ];

  const eventRulesAdditionalExcludes: { [k: string]: number } = {};
  for (const prefix of eventRulesExcludedPrefixes) {
    eventRulesAdditionalExcludes[prefix] = allEventRules.filter((a) =>
      a.startsWith(prefix)
    ).length;
  }

  await checkGeneric({
    label: "Event Rules",
    all: allEventRules,
    cfManaged: getArray("AWS::Events::Rule"),
    excludePrefixes: eventRulesAdditionalExcludes,
    deleteGenerator: eventsRule.generateDeleteCommands,
  });

  const allKmsKeys = await kmsKey.getAllKmsKeys();
  const kmsContainsExcludes = [
    "Tenable",
    "AWS Backups",
    "CloudTrail",
    "KMS key for encrypting logs",
  ];

  const kmsAdditionalContainsExcludes: { [k: string]: number } = {};
  for (const substring of kmsContainsExcludes) {
    kmsAdditionalContainsExcludes[substring] = allKmsKeys.filter((key) =>
      key.includes(substring)
    ).length;
  }

  // Treat KMS keys as managed if they're directly managed by CloudFormation
  // OR if they're referenced by a CloudFormation-managed KMS alias
  const directlyManagedKeys = getArray("AWS::KMS::Key");
  const cfManagedAliases = getArray("AWS::KMS::Alias");
  const keysFromAliases = await kmsKey.getKeysFromAliases(cfManagedAliases);

  // Combine both types - these are just key IDs
  const managedKeyIds = new Set([...directlyManagedKeys, ...keysFromAliases]);

  // For matching, we need to check if the key ID (before " - ") is in the managed set
  const treatedAsManagedKeys = allKmsKeys.filter((keyDetail) => {
    const keyId = keyDetail.split(" - ")[0];
    return managedKeyIds.has(keyId);
  });

  await checkGeneric({
    label: "KMS Keys",
    all: allKmsKeys,
    cfManaged: treatedAsManagedKeys,
    excludeContains: kmsAdditionalContainsExcludes,
    deleteGenerator: kmsKey.generateDeleteCommands,
  });

  // Get all CloudFormation stack names for matching (needed for both SGs and ENIs)
  const allStackSummaries = await cloudFormation.getAllStacks();
  const stackNames = allStackSummaries.map((s) => s.StackName!);
  const projectPrefixes = /^(seds|qmr|mcr|mfp|hcbs|carts)-/i; // |app-api

  const allSecurityGroups = await securityGroup.getAllSecurityGroups();
  const sgContainsExcludes = [
    "cmscloud",
    "main",
    "master",
    "default VPC security group",
  ]; // "default"

  const sgAdditionalContainsExcludes: { [k: string]: number } = {};
  for (const substring of sgContainsExcludes) {
    sgAdditionalContainsExcludes[substring] = allSecurityGroups.filter((sg) =>
      sg.toLowerCase().includes(substring.toLowerCase())
    ).length;
  }

  // Treat security groups that contain CloudFormation stack names as managed
  const managedSecurityGroups = getArray("AWS::EC2::SecurityGroup");
  const treatedAsManagedSecurityGroups = [...managedSecurityGroups];

  for (const stackName of stackNames) {
    // Try exact match first
    const exactMatches = allSecurityGroups.filter((sg) =>
      sg.includes(stackName)
    );
    treatedAsManagedSecurityGroups.push(...exactMatches);

    // Try matching without the project prefix
    const stackWithoutPrefix = stackName.replace(projectPrefixes, "");
    if (stackWithoutPrefix !== stackName && stackWithoutPrefix.length > 5) {
      const prefixMatches = allSecurityGroups.filter(
        (sg) =>
          sg.includes(stackWithoutPrefix) &&
          !treatedAsManagedSecurityGroups.includes(sg)
      );
      treatedAsManagedSecurityGroups.push(...prefixMatches);
    }
  }

  await checkGeneric({
    label: "Security Groups",
    all: allSecurityGroups,
    cfManaged: treatedAsManagedSecurityGroups,
    excludeContains: sgAdditionalContainsExcludes,
    deleteGenerator: securityGroup.generateDeleteCommands,
  });

  const allNetworkInterfaces = await eni.getAllNetworkInterfaces();

  const eniContainsExcludes = [
    "main",
    "master",
    "Transit Gateway",
    "VPC Endpoint Interface",
  ];

  const eniAdditionalContainsExcludes: { [k: string]: number } = {};
  for (const substring of eniContainsExcludes) {
    eniAdditionalContainsExcludes[substring] = allNetworkInterfaces.filter(
      (e) => e.toLowerCase().includes(substring.toLowerCase())
    ).length;
  }

  // Exclude ENIs that contain a CloudFormation stack name (treated as managed)
  // Stack names often have project prefixes (e.g., "seds-x8e03cb1432") but ENI descriptions
  // just have the suffix (e.g., "x8e03cb1432")
  const managedEnis = getArray("AWS::EC2::NetworkInterface");
  const treatedAsManagedEnis = [...managedEnis];

  for (const stackName of stackNames) {
    // Try exact match first
    const exactMatches = allNetworkInterfaces.filter((eni) =>
      eni.includes(stackName)
    );
    treatedAsManagedEnis.push(...exactMatches);

    // Try matching without the project prefix (e.g., "x8e03cb1432" from "seds-x8e03cb1432")
    const stackWithoutPrefix = stackName.replace(projectPrefixes, "");
    if (stackWithoutPrefix !== stackName && stackWithoutPrefix.length > 5) {
      const prefixMatches = allNetworkInterfaces.filter(
        (eni) =>
          eni.includes(stackWithoutPrefix) &&
          !treatedAsManagedEnis.includes(eni)
      );
      treatedAsManagedEnis.push(...prefixMatches);
    }
  }

  await checkGeneric({
    label: "Network Interfaces (ENIs)",
    all: allNetworkInterfaces,
    cfManaged: treatedAsManagedEnis,
    excludeContains: eniAdditionalContainsExcludes,
    deleteGenerator: eni.generateDeleteCommands,
  });

  generateDeleteCommands();
  console.log(`Scan complete. See ${outputFile}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
