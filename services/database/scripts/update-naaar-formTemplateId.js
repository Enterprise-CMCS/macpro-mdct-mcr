/*
 * Dry run:
 *   Local:
 *     DYNAMODB_URL="http://localhost:4566" node services/database/scripts/update-naaar-formTemplateId.js {REPORT_ID} {STATE}
 *   Branch:
 *     branchPrefix="YOUR BRANCH NAME" node services/database/scripts/update-naaar-formTemplateId.js {REPORT_ID} {STATE}
 *
 * Apply updates by adding apply=true to either command.
 *
 * Purpose:
 *   Update formTemplateId for one NAAAR report.
 */

const {
  buildDynamoClient,
  getItem,
  updateItem,
} = require("./utils/dynamodb.js");

const FORM_TEMPLATE_ID = "3Ik05bSf2qPoRVEbuMzvB9yZgmv";

const isLocal = Boolean(process.env.DYNAMODB_URL);
const shouldApply = process.env.apply === "true";
const branch = isLocal ? "localstack" : process.env.branchPrefix;
const reportId = process.argv[2];
const state = process.argv[3]?.toUpperCase();

async function handler() {
  if (!branch) {
    throw new Error(
      "Set branchPrefix for a deployed environment or DYNAMODB_URL for local execution."
    );
  }
  if (!reportId || !state) {
    throw new Error(
      "Usage: node services/database/scripts/update-naaar-formTemplateVersion.js REPORT_ID STATE"
    );
  }
  if (!/^[A-Z]{2}$/.test(state)) {
    throw new Error("STATE must be a two-letter state abbreviation.");
  }

  const tableName = `${branch}-naaar-reports`;
  buildDynamoClient();

  const report = await getItem({
    TableName: tableName,
    Key: { state, id: reportId },
  });
  if (!report) {
    throw new Error(
      `Report ${state}/${reportId} was not found in ${tableName}.`
    );
  }

  if (report.formTemplateId === FORM_TEMPLATE_ID) {
    console.log(
      `Report ${state}/${reportId} already uses ${FORM_TEMPLATE_ID}.`
    );
    return;
  }

  console.log(
    `\n${shouldApply ? "[APPLY]" : "[DRY RUN]"} ${state}/${reportId}: ${
      report.formTemplateId ?? "<missing>"
    } -> ${FORM_TEMPLATE_ID}`
  );

  if (shouldApply) {
    await updateItem({
      TableName: tableName,
      Key: { state, id: reportId },
      UpdateExpression: "SET #formTemplateId = :formTemplateId",
      ExpressionAttributeNames: {
        "#id": "id",
        "#formTemplateId": "formTemplateId",
      },
      ExpressionAttributeValues: {
        ":formTemplateId": FORM_TEMPLATE_ID,
      },
      ConditionExpression: "attribute_exists(#id)",
    });
  }

  console.log(`\n${shouldApply ? "Updated" : "Would update"} 1 report.`);
}

handler().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
