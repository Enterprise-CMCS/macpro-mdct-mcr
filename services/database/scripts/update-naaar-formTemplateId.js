/*
 * Dry run:
 *   Local:
 *     DYNAMODB_URL="http://localhost:4566" node services/database/scripts/update-naaar-formTemplateId.js
 *   Branch:
 *     branchPrefix="YOUR BRANCH NAME" node services/database/scripts/update-naaar-formTemplateId.js
 *
 * Apply updates by adding apply=true to either command.
 *
 * Purpose:
 *   Update formTemplateId and versionNumber for a fixed set of NAAAR reports.
 */

const { buildDynamoClient, scan, updateItem } = require("./utils/dynamodb.js");

const TARGET_REPORT_IDS = [
  "3GxlNc1LVEHuk7pn7hOjnJQS3kI",
  "3IYM5hW6bENJt76Bj3dNJLJuZ0T",
  "3IYTHKxpV2I8rxGCF22tfaKNK7m",
  "3IYTjpWV1VEb94YY2XYDk6RQQ6Y",
  "3IYfLZQLW9PzYfyZkGJwk0cLXm4",
  "3IYlBU3PMBZvuZ4YjjMreJJKKQt",
  "3IYtCw3Yryj5K7bYPuprGsuuK2v",
  "3IVuSwn3eDCI1MZmU5wl4bzT4yw",
  "3IgSa8PLY1H9huCgZpdUBlU1MBF",
  "3IgSklCDHHkGd6dsJgWvwcZsocg",
  "3IgkLgCUQTZW0zIi6lEiODXYizK",
  "3GuD63OE1dVWa2WF9Urp1g2WYqN",
  "3Ih8NiqBn1LAvhxgbxLOpRLthRn",
  "3HBbLS9AHhn35LktikjqzXKGYUp",
  "3GumSH2WRNbAASLBzmmIBXdFpqr",
  "3HrsKXTJ53eOORIeckxcqpCapC8",
  "3HY2HmECcUT4iClvBb4UmlpzGxi",
  "3HE97u3yF2R538GBYafTVXzdHwC", // pragma: allowlist secret
  "3HEniRk3Upq46zX1L7u6IhcMLie",
];
const FORM_TEMPLATE_ID = "3Ik05bSf2qPoRVEbuMzvB9yZgmv";
const VERSION_NUMBER = 9;

const isLocal = Boolean(process.env.DYNAMODB_URL);
const shouldApply = process.env.apply === "true";
const branch = isLocal ? "localstack" : process.env.branchPrefix;

async function handler() {
  if (!branch) {
    throw new Error(
      "Set branchPrefix for a deployed environment or DYNAMODB_URL for local execution."
    );
  }

  const tableName = `${branch}-naaar-reports`;
  buildDynamoClient();

  const reports = await scan({
    TableName: tableName,
    ProjectionExpression: "#state, #id, #formTemplateId, #versionNumber",
    ExpressionAttributeNames: {
      "#state": "state",
      "#id": "id",
      "#formTemplateId": "formTemplateId",
      "#versionNumber": "versionNumber",
    },
  });
  const reportsById = new Map(reports.map((report) => [report.id, report]));
  const missingReportIds = TARGET_REPORT_IDS.filter(
    (id) => !reportsById.has(id)
  );

  if (missingReportIds.length > 0) {
    throw new Error(
      `The following report IDs were not found in ${tableName}: ${missingReportIds.join(
        ", "
      )}`
    );
  }

  const reportsToUpdate = TARGET_REPORT_IDS.map((id) =>
    reportsById.get(id)
  ).filter(
    ({ formTemplateId, versionNumber }) =>
      formTemplateId !== FORM_TEMPLATE_ID || versionNumber !== VERSION_NUMBER
  );

  console.log(
    `\n${shouldApply ? "[APPLY]" : "[DRY RUN]"} ${reportsToUpdate.length} of ${
      TARGET_REPORT_IDS.length
    } reports in ${tableName} require an update.`
  );

  for (const { state, id, formTemplateId, versionNumber } of reportsToUpdate) {
    console.log(
      `  ${state}/${id}: formTemplateId ${
        formTemplateId ?? "<missing>"
      } -> ${FORM_TEMPLATE_ID}; versionNumber ${
        versionNumber ?? "<missing>"
      } -> ${VERSION_NUMBER}`
    );

    if (shouldApply) {
      await updateItem({
        TableName: tableName,
        Key: { state, id },
        UpdateExpression:
          "SET #formTemplateId = :formTemplateId, #versionNumber = :versionNumber",
        ExpressionAttributeNames: {
          "#id": "id",
          "#formTemplateId": "formTemplateId",
          "#versionNumber": "versionNumber",
        },
        ExpressionAttributeValues: {
          ":formTemplateId": FORM_TEMPLATE_ID,
          ":versionNumber": VERSION_NUMBER,
        },
        ConditionExpression: "attribute_exists(#id)",
      });
    }
  }

  console.log(
    `\n${shouldApply ? "Updated" : "Would update"} ${
      reportsToUpdate.length
    } reports.`
  );
}

handler().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
