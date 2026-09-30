/*
 * This script copies a single report (metadata + fieldData + formTemplate)
 * from one environment's to another, and appends a matching state user to
 * services/ui-auth/libs/users.json for you to commit and push up.
 *
 * The use case here is when design is looking to get user testing done
 * and wants to copy down a report thats in prod into val so the user
 * has a clean and familiar testing env to comment and play with.
 *
 * When I say this script copies a report, that means it does the following:
 *   1. DynamoDB item        {from}-{type}-reports        -> {to}-{type}-reports
 *   2. S3 fieldData         database-{from}-{type}/fieldData/{state}/{fieldDataId}.json
 *   3. S3 formTemplate      database-{from}-{type}/formTemplates/{formTemplateId}.json
 *
 * All of these data pieces are copied from one env and put into another.
 * The form-template-versions table is deliberately NOT copied: its
 * (reportType, versionNumber) key belong to the destination
 * environment would never be relevant in the new env.
 *
 * Before you can run this script, you need to get AWS Credentials to actually
 * be able to access the data. Heres how to do that!
 *
 * First-time Kion (CloudTamer) setup:
 *   0. (Pre-step) You need EUA job codes granting access to each MDCT/MCR
 *      AWS account (dev, val, and prod are three separate accounts). If
 *      you can't see an account in Kion, request the job code in EUA and
 *      wait for approval.
 *   1. Log in to the CMS Kion portal (cloudtamer.cms.gov) with your EUA
 *      credentials.
 *   3. Find the project/account (search "MCR") and note which is
 *      dev vs val vs prod.
 *   4. On the account, choose "Short-term Access Keys", pick your cloud
 *      access role, and Kion shows an Access Key ID, Secret Access Key, and
 *      Session Token.
 *   5. Setup your named profiles (instead of pasting creds into your shell):
 *      Add one block per environment to ~/.aws/credentials. The names must
 *      be mcr-{stage} (stages are main | val | production):
 *
 *     [mcr-main]
 *     aws_access_key_id     = ...
 *     aws_secret_access_key = ...
 *     aws_session_token     = ...
 *
 *     [mcr-val]
 *     aws_access_key_id     = ...
 *     aws_secret_access_key = ...
 *     aws_session_token     = ...
 *
 *     [mcr-production]
 *     aws_access_key_id     = ...
 *     aws_secret_access_key = ...
 *     aws_session_token     = ...
 *
 *   All three fields are required — short-term keys don't work without
 *   aws_session_token. You can verify each with
 *     `aws sts get-caller-identity --profile mcr-val`
 *
 * How to call this script:
 *   node services/database/scripts/copy-report-across-accounts.js \
 *     --type <mcpar|mlr|naaar> --state <XX> [--id <reportId>] \
 *     --from <main|val|production> --to <main|val> \
 *     [--unlock] [--user-email <email>] [--skip-user] [--dry-run]
 *
 * Examples:
 *   # A dry-run from Val -> Main
 *   node services/database/scripts/copy-report-across-accounts.js \
 *     --type mcpar --state AL --from val --to main --dry-run
 *
 *   # Actual Call from Prod -> val, passing the unlock prop for editing
 *   node services/database/scripts/copy-report-across-accounts.js \
 *     --type mlr --state MA --from production --to val --unlock
 *
 * Flags:
 *   --type          mcpar | mlr | naaar
 *   --state         two-letter state code (MD | WA | MI, etc..)
 *   --id            Report ID. Omitting this means the script will copy
 *                   the most recently altered non-archived report for the state
 *   --from / --to   From what env to which env. To does not allow you to pass
 *                   to production. Also picks the AWS profiles: mcr-{from}
 *                   and mcr-{to} (see setup above).
 *   --unlock        Flag to set report status as "In progress" and locked to false
 *                   on the copy. This makes sure a Submitted report becomes editable
 *                   without you having to go through the extra steps.
 *   --user-email    Flag to pass an email that will be added to the users.json. If
 *                   not passed here, it will default to adding
 *                   {STATE}.stateuser@test.com
 *   --skip-user     Optional flag incase you don't care to create a new user.
 *   --dry-run       Prints out what would happen if the script actually ran.
 */

const fs = require("node:fs");
const path = require("node:path");
const { createInterface } = require("node:readline/promises");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");
const { parseArgs } = require("node:util");

const reportTypes = ["mcpar", "mlr", "naaar"];
const stages = ["main", "val", "production"];
const appUrls = {
  main: "https://mdctmcrdev.cms.gov",
  val: "https://mdctmcrval.cms.gov",
};
const IN_PROGRESS = "In progress";
const STATE_USER_ROLE = "mdctmcr-state-user";

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "PR",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "ZZ",
];

const usersJsonPath = path.join(__dirname, "../../ui-auth/libs/users.json");

const fieldDataKey = (metadata) =>
  `fieldData/${metadata.state}/${metadata.fieldDataId}.json`;
const formTemplateKey = (metadata) =>
  `formTemplates/${metadata.formTemplateId}.json`;

function parseAndValidateArgs() {
  const { values } = parseArgs({
    options: {
      type: { type: "string" },
      state: { type: "string" },
      id: { type: "string" },
      from: { type: "string" },
      to: { type: "string" },
      unlock: { type: "boolean", default: false },
      "user-email": { type: "string" },
      "skip-user": { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
    },
  });

  for (const flag of ["type", "state", "from", "to"]) {
    if (!values[flag]) throw new Error(`--${flag} is required`);
  }

  const type = values.type.toLowerCase();
  const state = values.state.toUpperCase();
  if (!reportTypes.includes(type))
    throw new Error(`--type must be one of ${reportTypes.join(", ")}`);
  if (!states.includes(state))
    throw new Error(`--state "${state}" is not a known state code`);
  if (!stages.includes(values.from) || !stages.includes(values.to))
    throw new Error(`--from and --to must be one of ${stages.join(", ")}`);
  if (values.to === "production")
    throw new Error("You are not allowed to put data in production.");
  if (values.from === values.to) throw new Error("--from and --to must differ");

  return {
    type,
    state,
    id: values.id,
    from: values.from,
    to: values.to,
    unlock: values.unlock,
    userEmail: values["user-email"] ?? `${state}.stateuser@test.com`,
    skipUser: values["skip-user"],
    isDryRun: values["dry-run"],
  };
}

function makeEnv(stage, type) {
  const profile = `mcr-${stage}`;
  const config = { region: "us-east-1", profile };
  return {
    profile,
    stage,
    table: `${stage}-${type}-reports`,
    bucket: `database-${stage}-${type}`,
    ddb: DynamoDBDocumentClient.from(new DynamoDBClient(config)),
    s3: new S3Client({
      ...config,
      forcePathStyle: !!process.env.AWS_ENDPOINT_URL,
    }),
  };
}

async function assertDifferentAccounts(src, dst) {
  const identity = (profile) =>
    new STSClient({ region: "us-east-1", profile }).send(
      new GetCallerIdentityCommand({})
    );
  const [srcIdentity, dstIdentity] = await Promise.all([
    identity(src.profile),
    identity(dst.profile),
  ]);
  if (srcIdentity.Account === dstIdentity.Account) {
    throw new Error(
      `profiles "${src.profile}" and "${dst.profile}" resolve to the same AWS account (${srcIdentity.Account}). Every stage lives in its own account — check ~/.aws/credentials.`
    );
  }
  return { srcAccount: srcIdentity.Account, dstAccount: dstIdentity.Account };
}

async function getSourceMetadata(args, src) {
  if (args.id) {
    const { Item } = await src.ddb.send(
      new GetCommand({
        TableName: src.table,
        Key: { state: args.state, id: args.id },
      })
    );
    if (!Item) {
      throw new Error(
        `no report found in ${src.table} at state=${args.state}, id=${args.id}`
      );
    }
    if (Item.archived) {
      throw new Error(
        `report ${args.id} is archived. Please pick a different report.`
      );
    }
    return Item;
  }

  const items = [];
  let ExclusiveStartKey;
  do {
    const response = await src.ddb.send(
      new QueryCommand({
        TableName: src.table,
        KeyConditionExpression: "#state = :state",
        ExpressionAttributeNames: { "#state": "state" },
        ExpressionAttributeValues: { ":state": args.state },
        ExclusiveStartKey,
      })
    );
    items.push(...(response.Items ?? []));
    ExclusiveStartKey = response.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  const candidates = items
    .filter((item) => !item.archived)
    .toSorted(
      (a, b) => (Number(b.lastAltered) || 0) - (Number(a.lastAltered) || 0)
    );
  if (candidates.length === 0) {
    throw new Error(
      `no non-archived ${args.type} reports found for ${args.state} in ${src.table}`
    );
  }
  console.log(`Found ${candidates.length} candidate report(s), newest first:`);
  for (const item of candidates.slice(0, 5)) {
    console.log(
      `  ${item.id}  ${reportName(item)}  status=${
        item.status
      }  lastAltered=${new Date(Number(item.lastAltered) || 0).toISOString()}`
    );
  }
  console.log("Selected the newest. Re-run with --id to pick another.\n");
  return candidates[0];
}

function reportName(metadata) {
  return metadata.programName ?? metadata.submissionName ?? "(unnamed)";
}

async function fetchS3Json(s3, bucket, key) {
  try {
    const { Body } = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
    const raw = await Body.transformToString();
    JSON.parse(raw);
    return raw;
  } catch (error) {
    throw new Error(
      `could not read s3://${bucket}/${key} (${error.name}: ${error.message})`,
      { cause: error }
    );
  }
}

function applyTransforms(args, metadata) {
  const copy = structuredClone(metadata);
  if (args.unlock) {
    copy.status = IN_PROGRESS;
    copy.locked = false;
    if (args.type === "mlr") copy.isComplete = false;
  }
  return copy;
}

async function getDestinationItem(dst, metadata) {
  try {
    const { Item } = await dst.ddb.send(
      new GetCommand({
        TableName: dst.table,
        Key: { state: metadata.state, id: metadata.id },
      })
    );
    return Item;
  } catch (error) {
    throw new Error(
      `pre-flight read of ${dst.table} failed (${error.name}: ${error.message}). Does the ${dst.profile} profile hold the ${dst.stage} account's keys?`,
      { cause: error }
    );
  }
}

async function confirmOrAbort() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question('Type "yes" to copy: ');
  rl.close();
  return answer.trim() === "yes";
}

async function writeDestination(dst, { metadata, fieldDataRaw, templateRaw }) {
  for (const [key, body] of [
    [formTemplateKey(metadata), templateRaw],
    [fieldDataKey(metadata), fieldDataRaw],
  ]) {
    await dst.s3.send(
      new PutObjectCommand({
        Bucket: dst.bucket,
        Key: key,
        Body: body,
        ContentType: "application/json",
      })
    );
    console.log(`Wrote s3://${dst.bucket}/${key}`);
  }
  await dst.ddb.send(new PutCommand({ TableName: dst.table, Item: metadata }));
  console.log(`Wrote item ${metadata.id} to ${dst.table}`);
}

async function verifyDestination(dst, metadata) {
  const failures = [];
  const check = (label, passed) => {
    console.log(`  ${passed ? "PASS" : "FAIL"}  ${label}`);
    if (!passed) failures.push(label);
  };

  const { Item } = await dst.ddb.send(
    new GetCommand({
      TableName: dst.table,
      Key: { state: metadata.state, id: metadata.id },
    })
  );
  check(
    "metadata read-back",
    Item !== undefined &&
      Item.fieldDataId === metadata.fieldDataId &&
      Item.formTemplateId === metadata.formTemplateId
  );
  for (const key of [formTemplateKey(metadata), fieldDataKey(metadata)]) {
    try {
      await fetchS3Json(dst.s3, dst.bucket, key);
      check(`s3://${dst.bucket}/${key}`, true);
    } catch (error) {
      check(`s3://${dst.bucket}/${key}`, false);
      console.log(`        ${error.message}`);
    }
  }
  if (failures.length > 0) {
    throw new Error(
      `verification failed (${failures.join("; ")}) — the copy is incomplete. Re-run the same command.`
    );
  }
}

function buildUserEntry(userEmail, state) {
  return {
    username: userEmail,
    attributes: [
      { Name: "email", Value: userEmail },
      { Name: "given_name", Value: state },
      { Name: "family_name", Value: "StateUser" },
      { Name: "email_verified", Value: "true" },
      { Name: "custom:cms_roles", Value: STATE_USER_ROLE },
      { Name: "custom:cms_state", Value: state },
    ],
  };
}

function updateUsersJson(args) {
  const users = JSON.parse(fs.readFileSync(usersJsonPath, "utf8"));
  const attribute = (user, name) =>
    user.attributes.find((attr) => attr.Name === name)?.Value;

  if (
    users.some(
      (user) => user.username.toLowerCase() === args.userEmail.toLowerCase()
    )
  ) {
    console.log(
      `users.json already contains ${args.userEmail} — skipping user creation.`
    );
    return;
  }
  const existing = users.find(
    (user) =>
      attribute(user, "custom:cms_roles") === STATE_USER_ROLE &&
      attribute(user, "custom:cms_state") === args.state
  );
  if (existing) {
    console.log(
      `Note: existing user ${existing.username} can already access ${args.state} reports; appending ${args.userEmail} anyway (use --skip-user to avoid this).`
    );
  }
  users.push(buildUserEntry(args.userEmail, args.state));
  fs.writeFileSync(usersJsonPath, JSON.stringify(users, null, 2) + "\n");
  console.log(`Appended ${args.userEmail} to ${usersJsonPath}`);
}

async function handler() {
  const args = parseAndValidateArgs();
  const src = makeEnv(args.from, args.type);
  const dst = makeEnv(args.to, args.type);
  const { srcAccount, dstAccount } = await assertDifferentAccounts(src, dst);

  const metadata = await getSourceMetadata(args, src);
  const [fieldDataRaw, templateRaw, existingDestItem] = await Promise.all([
    fetchS3Json(src.s3, src.bucket, fieldDataKey(metadata)),
    fetchS3Json(src.s3, src.bucket, formTemplateKey(metadata)),
    getDestinationItem(dst, metadata),
  ]);
  const outMetadata = applyTransforms(args, metadata);

  console.log(`\n==${args.isDryRun ? "[DRY RUN]" : ""} Copy plan ==`);
  console.log(`  ${src.table} (account ${srcAccount})`);
  console.log(`    -> ${dst.table} (account ${dstAccount})`);
  console.log(`  ${src.bucket} -> ${dst.bucket}`);
  console.log(`  report: ${metadata.id}  ${reportName(metadata)}`);
  console.log(
    `  status=${metadata.status}  locked=${metadata.locked}  submissionCount=${metadata.submissionCount}`
  );
  console.log(
    `  fieldData:    ${fieldDataKey(metadata)} (${Buffer.byteLength(fieldDataRaw)} bytes)`
  );
  console.log(
    `  formTemplate: ${formTemplateKey(metadata)} (${Buffer.byteLength(templateRaw)} bytes)`
  );
  if (args.unlock) {
    console.log(
      `  --unlock: copy will have status "${IN_PROGRESS}", locked=false`
    );
    if (Number(metadata.submissionCount) >= 1)
      console.log(
        `  (submissionCount >= 1, so the dashboard will label it "In revision" — expected)`
      );
  }
  if (existingDestItem) {
    console.log(
      `  NOTE: destination already has an item at this id (prior copy) — it will be overwritten.`
    );
    if (
      existingDestItem.fieldDataId !== metadata.fieldDataId ||
      existingDestItem.formTemplateId !== metadata.formTemplateId
    ) {
      console.log(
        `  WARNING: the existing destination item points at different fieldData/formTemplate ids; its old S3 objects will be orphaned.`
      );
    }
  }
  if (!args.skipUser) {
    console.log(
      `  users.json: will append ${args.userEmail} (state ${args.state}) if not already present`
    );
  }

  if (args.isDryRun) {
    console.log("\nDry run complete!");
    return;
  }

  console.log("");
  if (!(await confirmOrAbort())) {
    console.log("Script has been aborted.");
    return;
  }

  await writeDestination(dst, {
    metadata: outMetadata,
    fieldDataRaw,
    templateRaw,
  });
  console.log("\nVerifying destination:");
  await verifyDestination(dst, outMetadata);

  if (!args.skipUser) updateUsersJson(args);

  console.log(`\n== Done ==`);
  console.log(
    `  Report ${metadata.id} (${reportName(metadata)}) is live in ${dst.stage}.`
  );
  console.log(` App: ${appUrls[dst.stage]}`);
  console.log(
    `  Login: ${args.skipUser ? `any ${args.state} state user` : args.userEmail}`
  );
  if (!args.skipUser) {
    console.log(
      `  users.json was updated locally only. You need to commit and PR it. The user is created in the ${dst.stage} Cognito pool by the next deploy of that stage, with password equal to that 1password's bootstrapUsersPassword.`
    );
    console.log(
      `  Heads up: users.json is shared across all stages, so this login will eventually exist in every pool, including production — flag that on the PR.`
    );
  }
}

handler().catch((error) => {
  const prefix = error.name === "Error" ? "" : `${error.name}: `;
  console.error(`\nError: ${prefix}${error.message}`);
  const causeName = error.cause?.name ?? error.name;
  if (causeName === "ExpiredTokenException" || causeName === "ExpiredToken") {
    console.error(
      "Your short-term keys expired. Regenerate them in cloudtamer/Kion, re-paste into ~/.aws/credentials, and re-run the script."
    );
  } else if (causeName === "CredentialsProviderError") {
    console.error(
      "Check that both profiles exist in ~/.aws/credentials (see the setup guide in this file's header)."
    );
  }
  process.exitCode = 1;
});
