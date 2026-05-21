/* eslint-disable no-console */
/*
 * Local:
 *   test=true DYNAMODB_URL="http://localhost:4566" S3_LOCAL_ENDPOINT="http://localhost:4566" node services/database/scripts/fix-naaar-specialty-details-required.js
 * Branch:
 *   branchPrefix="YOUR BRANCH NAME" node services/database/scripts/fix-naaar-specialty-details-required.js
 *
 * To run the script without persisting updates, set test=true at the beginning of the command
 *
 * Purpose:
 *   For NAAAR reports created after 2026-02-19 00:00:00 UTC, promote the
 *   following "II.A.2 ... specialty details" fields from optional to required
 *   inside section "II. Program-level access and network adequacy standards":
 *     - II.A.2 Primary care specialty details
 *     - II.A.2 Specialist specialty details (a.k.a. "Specialty details")
 *     - II.A.2 OB/GYN specialty details
 *
 *   For each report we:
 *     1. Patch the S3 form template: rename "(optional)" → "(required)" in
 *        the field label and set validation to ValidationType.TEXT.
 *     2. Iterate through each entered standard. If the parent "II.A.1 Provider type
 *        covered by standard" was answered with Primary care / Specialist /
 *        OB/GYN but the corresponding child specialty details text is empty,
 *        flag the report as needing follow-up.
 *     3. For non-Submitted reports (In progress / Not started) that have
 *        missing required answers, record them as having had their state
 *        re-evaluated. Submitted reports are NEVER mutated.
 */

const { buildDynamoClient, scan } = require("./utils/dynamodb.js");
const { buildS3Client, list, putObject, getObject } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;
const isTest = !!process.env.test;
const branch = isLocal ? "localstack" : process.env.branchPrefix;
const tableName = `${branch}-naaar-reports`;
const bucketName = `database-${branch}-naaar`;

// Thursday, February 19, 2026 at 12:00:00 AM UTC
const CREATED_AFTER = 1771459200000;

const SECTION_NAME = "II. Program-level access and network adequacy standards";
const PROVIDER_TYPE_FIELD_ID = "standard_coreProviderType";

// Choice IDs for the three provider types whose specialty details are
// being promoted from optional to required.
const REQUIRED_SPECIALTY_CHILD_IDS = {
  primaryCare: "standard_coreProviderType-UZK4hxPVnuYGcIgNzYFHCk", // pragma: allowlist secret
  specialist: "standard_coreProviderType-uITThePQiXntwGGViPTD62", // pragma: allowlist secret
  obgyn: "standard_coreProviderType-kV7553HIWXekySIFLiMXLW", // pragma: allowlist secret
};

const REQUIRED_CHILD_ID_LIST = Object.values(REQUIRED_SPECIALTY_CHILD_IDS);

const STATUS = {
  IN_PROGRESS: "In progress",
  NOT_STARTED: "Not started",
  SUBMITTED: "Submitted",
};

const formTemplatesPatched = [];
const reportsToReceiveUpdate = [];
const nonSubmittedReports = [];

async function handler() {
  try {
    const { reports, totalScanned, skippedByCreatedAt } = await getDbItems();

    console.log(
      `\n==${isTest ? " [TEST]" : ""} Scanned ${totalScanned} NAAAR reports in table ${tableName} ==`
    );
    console.log(
      `  Skipped ${skippedByCreatedAt} reports that did not match the createdAt > ${new Date(
        CREATED_AFTER
      ).toISOString()} requirement.`
    );
    console.log(
      `  ${reports.length} reports matched the criteria and will be processed.\n`
    );

    if (reports.length === 0) return;

    await processReports(reports);

    console.log(`\n${isTest ? "[TEST] " : ""}Summary:`);
    console.log(`  Total reports scanned: ${totalScanned}`);
    console.log(
      `  Reports skipped (createdAt not after cutoff): ${skippedByCreatedAt}`
    );
    console.log(`  Reports processed: ${reports.length}`);
    console.log(`  Form templates patched: ${formTemplatesPatched.length}`);
    console.log(
      `  Reports flagged as missing required details: ${reportsToReceiveUpdate.length}`
    );
    console.log(
      `  Non-submitted reports that were updated: ${nonSubmittedReports.length}`
    );

    console.log("\n-- Form templates patched --");
    console.log(formTemplatesPatched);
    console.log(
      "\n-- Reports to receive update (Including Submitted Reports) --"
    );
    console.log(reportsToReceiveUpdate);
    console.log(
      "\n-- Non-submitted reports that were updated (In Progress / Not Started only) --"
    );
    console.log(nonSubmittedReports);

    return {
      statusCode: 200,
      body: "All done!",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: error.message,
    };
  }
}

async function getDbItems() {
  buildDynamoClient();
  const items = await scan({ TableName: tableName });
  const reports = filterReports(items);
  const skippedByCreatedAt = items.filter(
    ({ createdAt, archived }) =>
      !archived && !(typeof createdAt === "number" && createdAt > CREATED_AFTER)
  ).length;
  return {
    reports,
    totalScanned: items.length,
    skippedByCreatedAt,
  };
}

// Only return reports created after the cutoff date that are not archived.
function filterReports(items) {
  return items.filter(
    ({ createdAt, archived }) =>
      typeof createdAt === "number" && createdAt > CREATED_AFTER && !archived
  );
}

async function getS3Items(prefix) {
  buildS3Client();
  console.log(`Getting items with prefix ${prefix} from ${bucketName}`);
  return await list({
    Bucket: bucketName,
    Prefix: prefix,
  });
}

async function processReports(reports) {
  buildS3Client();
  const fieldDataRecords = await getS3Items("fieldData/");
  const formTemplatesRecords = await getS3Items("formTemplates/");

  const formTemplateCache = new Map();

  for (const report of reports) {
    const { fieldDataId, formTemplateId, id, programName, state, status } =
      report;

    const fieldDataObj = fieldDataRecords.find((dataObj) =>
      dataObj.Key.includes(fieldDataId)
    );
    const formTemplateObj = formTemplatesRecords.find((dataObj) =>
      dataObj.Key.includes(formTemplateId)
    );

    if (!fieldDataObj || !formTemplateObj) {
      console.warn(
        `Skipping report ${id}: missing S3 fieldData or formTemplate object.`
      );
      continue;
    }

    const fieldDataKey = fieldDataObj.Key;
    const formTemplateKey = formTemplateObj.Key;

    // First patch the form template (only do once per unique template).
    if (!formTemplateCache.has(formTemplateKey)) {
      const template = await getObject({
        Key: formTemplateKey,
        Bucket: bucketName,
      });
      const patched = patchFormTemplate(template);
      if (patched && !isTest) {
        await putObject({
          Bucket: bucketName,
          Key: formTemplateKey,
          Body: JSON.stringify(template),
          ContentType: "application/json",
        });
      }
      if (patched) formTemplatesPatched.push(formTemplateKey);
      formTemplateCache.set(formTemplateKey, true);
    }

    // Then inspect field data for missing required specialty details.
    const fieldData = await getObject({
      Key: fieldDataKey,
      Bucket: bucketName,
    });

    const missingFields = findMissingSpecialtyDetails(fieldData);

    if (missingFields.length > 0) {
      const info = `ID: ${id}, Program: ${programName}, State: ${state}, Status: ${status}, Missing: ${missingFields.join(", ")}`;
      reportsToReceiveUpdate.push(info);

      // Finally update our count of non-subitted reports that would receive an update
      if (status === STATUS.IN_PROGRESS || status === STATUS.NOT_STARTED) {
        nonSubmittedReports.push(info);
      }
    }
  }
}

/**
 * Look through the form template and, within the standards drawer form, rename the
 * three "(optional)" specialty detail labels to "(required)" and set their
 * validation to ValidationType.TEXT.
 *
 * Returns true if anything was changed.
 */
function patchFormTemplate(template) {
  const route = findStandardsRoute(template);
  if (!route) return false;

  const drawerForm = route.drawerForm;
  if (!drawerForm || !Array.isArray(drawerForm.fields)) return false;

  const providerTypeField = drawerForm.fields.find(
    (field) => field.id === PROVIDER_TYPE_FIELD_ID
  );
  if (!providerTypeField?.props?.choices) return false;

  let didChange = false;

  for (const choice of providerTypeField.props.choices) {
    if (!Array.isArray(choice.children)) continue;
    for (const child of choice.children) {
      if (!REQUIRED_CHILD_ID_LIST.includes(child.id)) continue;

      // Replace "(optional)" with "(required)"
      const originalLabel = child.props?.label ?? "";
      const newLabel = originalLabel.replaceAll("(optional)", "(required)");
      if (newLabel !== originalLabel) {
        child.props.label = newLabel;
        didChange = true;
      }

      // Ensure ValidationType.TEXT
      if (child.validation?.type !== "text") {
        child.validation = { ...child.validation, type: "text" };
        didChange = true;
      }
    }
  }

  return didChange;
}

function findStandardsRoute(template) {
  const routes = Array.isArray(template?.routes) ? template.routes : [];
  for (const route of routes) {
    if (route?.name === SECTION_NAME) return route;
    // Walk one level of children just in case.
    if (Array.isArray(route?.children)) {
      for (const child of route.children) {
        if (child?.name === SECTION_NAME) return child;
      }
    }
  }
  return null;
}

/**
 * For each standard entity in fieldData, determine whether the user selected
 * Primary care / Specialist / OB/GYN as the provider type but left the
 * corresponding (now-required) specialty details child blank.
 *
 * Returns an array of unique short labels for the fields that are missing
 * answers across all standards on the report.
 */
function findMissingSpecialtyDetails(fieldData) {
  const standards = Array.isArray(fieldData?.standards)
    ? fieldData.standards
    : [];

  const missing = new Set();

  for (const standard of standards) {
    const selectedChoices = Array.isArray(standard?.[PROVIDER_TYPE_FIELD_ID])
      ? standard[PROVIDER_TYPE_FIELD_ID]
      : [];
    const selectedKeys = selectedChoices
      .map((choice) => choice?.key)
      .filter(Boolean);

    for (const [shortName, childId] of Object.entries(
      REQUIRED_SPECIALTY_CHILD_IDS
    )) {
      if (!selectedKeys.includes(childId)) continue;
      const childAnswer = standard?.[childId];
      if (
        childAnswer === undefined ||
        childAnswer === null ||
        (typeof childAnswer === "string" && childAnswer.trim() === "")
      ) {
        missing.add(shortName);
      }
    }
  }

  return [...missing];
}

// Only auto-run when invoked directly
if (require.main === module) {
  handler();
}