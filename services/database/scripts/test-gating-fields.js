/**
 * Script to add gating fields to frozen form templates for local testing
 *
 * This script is used to test the fix for CMDCT-6463, which addresses:
 * 1. Gating radio questions not persisting on drawer pages
 * 2. Export showing "Not answered" for answered gating questions
 *
 * The bug only affects reports with frozen templates created before PR #12797
 * (summer2026SansQm flag cleanup) that removed these gating fields.
 *
 * Usage:
 *   node services/database/scripts/test-gating-fields.js <REPORT_ID> <STATE>
 *
 * Example:
 *   node services/database/scripts/test-gating-fields.js 3Hods1BEDWIw2ts1FHTrSr271fx MN
 */

const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const region = "us-east-1";
const s3Client = new S3Client({
  region,
  endpoint: "http://s3.localhost.localstack.cloud:4566",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test", // pragma: allowlist secret
  },
});

const dynamoClient = new DynamoDBClient({
  region,
  endpoint: "http://localhost.localstack.cloud:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test", // pragma: allowlist secret
  },
});

const bucketName = process.env.MCPAR_FORM_BUCKET || "database-localstack-mcpar";
const tableName = process.env.McparReportsTable || "localstack-mcpar-reports";

// The gating radio field definitions that were removed in PR #12797
const GATING_FIELDS = {
  plan_priorAuthorizationReporting: {
    id: "plan_priorAuthorizationReporting",
    type: "radio",
    validation: "radio",
    props: {
      label: "Are you reporting data prior to June 2026?",
      choices: [
        { id: "yes", label: "Yes", value: "Yes" },
        {
          id: "no",
          label: "Not reporting data",
          value: "Not reporting data",
        },
      ],
    },
  },
  plan_patientAccessApiReporting: {
    id: "plan_patientAccessApiReporting",
    type: "radio",
    validation: "radio",
    props: {
      label: "Are you reporting data prior to June 2026?",
      choices: [
        { id: "yes", label: "Yes", value: "Yes" },
        {
          id: "no",
          label: "Not reporting data",
          value: "Not reporting data",
        },
      ],
    },
  },
};

async function getObject(bucket, key) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3Client.send(command);
  const bodyString = await response.Body.transformToString();
  return JSON.parse(bodyString);
}

async function putObject(bucket, key, data) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: JSON.stringify(data, null, 2),
    ContentType: "application/json",
  });
  await s3Client.send(command);
}

async function getReport(state, reportId) {
  const command = new GetItemCommand({
    TableName: tableName,
    Key: marshall({ state, id: reportId }),
  });
  const response = await dynamoClient.send(command);
  return response.Item ? unmarshall(response.Item) : null;
}

function removeDuplicateFields(template) {
  let removed = 0;

  function traverseRoutes(routes) {
    for (const route of routes) {
      if (route.form && route.form.fields) {
        const seenIds = new Set();
        const uniqueFields = [];

        for (const field of route.form.fields) {
          if (!seenIds.has(field.id)) {
            seenIds.add(field.id);
            uniqueFields.push(field);
          } else {
            console.log(`    - Removed duplicate: ${field.id}`);
            removed++;
          }
        }

        route.form.fields = uniqueFields;
      }

      if (route.children) {
        traverseRoutes(route.children);
      }
    }
  }

  if (template.routes) {
    traverseRoutes(template.routes);
  }

  return removed;
}

function addGatingFieldToRoute(route, fieldId, field) {
  if (
    route.path === "/mcpar/plan-level-indicators/prior-authorization" &&
    fieldId === "plan_priorAuthorizationReporting"
  ) {
    route.form = route.form || { id: "dpa-gating", fields: [] };

    // Check if field already exists
    const fieldExists = route.form.fields.some((f) => f.id === fieldId);
    if (fieldExists) {
      console.log(
        `  ⚠ ${fieldId} already exists in Prior Authorization page (skipping)`
      );
      return false;
    }

    console.log(`  ✓ Adding ${fieldId} to Prior Authorization page`);
    route.form.fields.unshift(field);
    return true;
  }

  if (
    route.path === "/mcpar/plan-level-indicators/patient-access-api" &&
    fieldId === "plan_patientAccessApiReporting"
  ) {
    route.form = route.form || { id: "dpaa-gating", fields: [] };

    // Check if field already exists
    const fieldExists = route.form.fields.some((f) => f.id === fieldId);
    if (fieldExists) {
      console.log(
        `  ⚠ ${fieldId} already exists in Patient Access API page (skipping)`
      );
      return false;
    }

    console.log(`  ✓ Adding ${fieldId} to Patient Access API page`);
    route.form.fields.unshift(field);
    return true;
  }

  return false;
}

function addGatingFieldsToTemplate(template) {
  let modified = false;

  function traverseRoutes(routes) {
    for (const route of routes) {
      for (const [fieldId, field] of Object.entries(GATING_FIELDS)) {
        if (addGatingFieldToRoute(route, fieldId, field)) {
          modified = true;
          // Also add to validationJson if it exists and field is not already there
          if (template.validationJson && !template.validationJson[fieldId]) {
            template.validationJson[fieldId] = "radio";
            console.log(`    - Added ${fieldId} to validationJson`);
          }
        }
      }

      if (route.children) {
        traverseRoutes(route.children);
      }
    }
  }

  if (template.routes) {
    traverseRoutes(template.routes);
  }

  return modified;
}

async function main() {
  const [reportId, state] = process.argv.slice(2);

  if (!reportId || !state) {
    throw new Error(`Missing required arguments

Usage: node test-gating-fields.js <REPORT_ID> <STATE>

Example: node test-gating-fields.js 3Hods1BEDWIw2ts1FHTrSr271fx MN

This script adds the gating radio fields (removed in PR #12797) back to a 
report's frozen form template for testing the CMDCT-6463 fix.`);
  }

  console.log(`\n📋 Looking up report ${reportId} in ${state}...\n`);

  const report = await getReport(state, reportId);
  if (!report) {
    throw new Error(`Report not found: ${reportId} in ${state}

Make sure:
  - LocalStack is running (npm run local)
  - You created a report through the UI
  - The report ID and state are correct`);
  }

  console.log(`✓ Found report: ${report.programName}`);
  console.log(`  Form Template ID: ${report.formTemplateId}\n`);

  const templateKey = `formTemplates/${report.formTemplateId}.json`;
  console.log(`📥 Fetching template from S3: ${templateKey}...\n`);

  const template = await getObject(bucketName, templateKey);

  // First, remove any duplicate fields
  console.log("🔧 Cleaning up duplicate fields...\n");
  const duplicatesRemoved = removeDuplicateFields(template);
  if (duplicatesRemoved > 0) {
    console.log(`  Removed ${duplicatesRemoved} duplicate field(s)\n`);
  }

  // Then add gating fields
  console.log("🔧 Adding gating fields to template...\n");
  const fieldsAdded = addGatingFieldsToTemplate(template);

  if (duplicatesRemoved > 0 || fieldsAdded) {
    console.log("\n💾 Saving modified template to S3...\n");
    await putObject(bucketName, templateKey, template);
    console.log("✅ Done! The report's frozen template has been updated.\n");
    console.log("Next steps:");
    console.log("1. Hard refresh your browser (Cmd+Shift+R / Ctrl+Shift+R)");
    console.log("2. Go to Prior Authorization or Patient Access API page");
    console.log("3. Test the fix:");
    console.log("   - Open a plan drawer, edit something, save and close");
    console.log("   - Answer the gating question");
    console.log("   - Navigate away and come back");
    console.log("   - ✅ The answer should persist (not show 'Not answered')");
    console.log("4. Test export:");
    console.log("   - Export the report");
    console.log("   - ✅ The gating answer should display correctly\n");
  } else {
    console.log(
      "\n✅ No changes needed - template is already configured correctly.\n"
    );
  }
}

main().catch((error) => {
  console.error("\n❌ Error:", error.message);
  console.error("\nStack trace:", error.stack);
  throw error;
});
