/*
 * Dry run:
 *   Local:
 *     DYNAMODB_URL="http://localhost:4566" node services/database/scripts/update-naaar-formTemplateId.js
 *   Branch:
 *     branchPrefix="{BRANCH_PREFIX}" node services/database/scripts/update-naaar-formTemplateId.js
 *
 * Apply updates by adding apply=true to the start of either command:
 *    apply=true branchPrefix="{BRANCH_PREFIX}" node services/database/scripts/update-naaar-formTemplateId.js
 *
 * Purpose:
 *   Update formTemplateId and versionNumber for a fixed set of NAAAR reports.
 */

const { buildDynamoClient, scan, updateItem } = require("./utils/dynamodb.js");

/* NOTE: The following variables are placeholders so that no real report or form template
IDs are committed to the repository.
* 1. TARGET_REPORT_IDS is an array of strings containing the list affected reports' IDs
* 2. FORM_TEMPLATE_ID is the latest form template ID
* 3. VERSION_NUMBER is the latest form template version number */
const TARGET_REPORT_IDS = [""];
const FORM_TEMPLATE_ID = "";
const VERSION_NUMBER = -1;

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
