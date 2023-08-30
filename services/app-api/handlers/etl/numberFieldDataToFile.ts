/* eslint-disable no-console */
import { APIGatewayProxyResult } from "aws-lambda";
import s3Lib, {
  getFieldDataKey,
  getFormTemplateKey,
} from "../../utils/s3/s3-lib";
import {
  AnyObject,
  FormField,
  FormJson,
  ReportJson,
  ReportMetadata,
  ReportRoute,
  ReportType,
} from "../../utils/types";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import {
  formTemplateTableName,
  reportBuckets,
  reportTables,
} from "../../utils/constants/constants";
import {
  Categories,
  ExtractResult,
  FieldData,
  FieldTemplate,
  FormatLevel,
} from "./numberFieldValueCategorization";

/*
 * Number Field Data To File
 * -------------------------
 * This script was written in mid-2023, as part of an effort to be more strict
 * about validation of numeric data in reports. Until early 2023, validation
 * was fairly permissive, with much of the work being offloaded to the masking
 * code. After tightening up the validation for new data, we wanted to ensure
 * that all existing data was also clean - but it's hard to write a cleanup
 * script for data you can't see. So, this script gets all the data.
 *
 * This isn't an ETL, strictly speaking, because there is no Load step. The
 * script first fetches all versions of all form templates, so that it can
 * walk through them and gather the IDs of all numeric fields. It then fetches
 * every single report, and pulls the value entered for each numeric field.
 * Those values are then classified with a FormatLevel. Any value which
 * doesn't conform to the strictest validation rules is collected, and
 * ultimately logged out to the console.
 *
 * This script was written at a time when the number of reports in the dev
 * environment was around 2800. That made this script a challenge to run within
 * an AWS lambda, because fetching 2800 reports will run you into the 15-minute
 * timeout limit very quickly. However, since this script is a glorified query
 * which can run with readonly permissions, we ultimately just gave up on
 * lambdas and ran it against the dev environment from a developer's machine.
 *
 * The followup script is numberFieldCleanup.ts.
 */

/**
 * This function is exposed as a lambda via the serverless.yml file
 */
export const exportNumericData = async (): Promise<APIGatewayProxyResult> => {
  try {
    await doExport();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Export complete",
      }),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
};

/**
 * This function does the work.
 */
export async function doExport() {
  console.log(`Preprocessing all form templates - ${performance.now()}`);

  const reportsToFix: ExtractResult[] = [];
  const valueCategories = Categories.instantiate();
  const numericFieldsByFormTemplate = new Map<string, FieldTemplate[]>();
  for await (const formTemplate of getAllFormTemplates()) {
    console.log(
      `Processing formTemplateId ${formTemplate.id} - ${performance.now()}`
    );
    const fieldList = [...iterateNumericFieldsInForm(formTemplate)];
    numericFieldsByFormTemplate.set(formTemplate.id!, fieldList);
  }

  for (const reportType of Object.values(ReportType)) {
    console.log(`Starting ${reportType} extract - ${performance.now()}`);

    for await (const metadata of getAllReportMetadataForType(reportType)) {
      const reportData = await getReportData(metadata);
      const fieldList = numericFieldsByFormTemplate.get(
        metadata.formTemplateId
      )!;

      if (!fieldList)
        throw new Error(
          `Field list not found for formTemplateId ${metadata.formTemplateId}`
        );

      const fieldsToFix: FieldData[] = [];
      for (const fieldTemplate of fieldList) {
        const valuesToFix = Array.from(
          getValuesFromReport(reportData, fieldTemplate)
        )
          .map((value, index) => {
            const category = valueCategories.find((cat) => cat.matcher(value))!;
            return {
              fieldId: fieldTemplate.fieldId,
              entityType: fieldTemplate.entityType,
              index,
              value,
              level: category.level,
            };
          })
          .filter(({ value, level }) => !!value && level !== "good");
        fieldsToFix.push(...valuesToFix);
      }

      if (fieldsToFix.length > 0) {
        reportsToFix.push({
          report: enhanceMetadata(metadata, reportData),
          fields: fieldsToFix,
        });
      }

      console.log(`Processed report ${metadata.id} - ${performance.now()}`);
    }
  }

  console.log(
    `${reportsToFix.length} reports need fixup: ${reportsToFix.map(
      (rtf) => rtf.report.id
    )}`
  );
  console.log(formatResultsAsTable(reportsToFix));
  return reportsToFix;
}

/**
 * Scan the entire form template version table,
 * and fetch each template from the bucket.
 */
const getAllFormTemplates = async function* () {
  const tableIterator = dynamodbLib.scanIterator({
    TableName: formTemplateTableName,
  });

  for await (const formTemplateMetadata of tableIterator) {
    const reportJson = (await s3Lib.get({
      Bucket: reportBuckets[formTemplateMetadata.reportType as ReportType],
      Key: getFormTemplateKey(formTemplateMetadata.id),
    })) as ReportJson;
    yield {
      id: formTemplateMetadata.id,
      ...reportJson,
    };
  }
};

/**
 * Given an array of report routes, iterate through them and all of their children
 */
const iterateRoutesIn = function* (
  routes: ReportRoute[]
): Generator<ReportRoute, void, undefined> {
  for (let route of routes) {
    yield route;
    if (route.children) {
      yield* iterateRoutesIn(route.children);
    }
  }
};

/**
 * Given a report route, iterate through all of its forms
 */
const iterateFormsIn = (route: ReportRoute) => {
  // This filter catches form, modalForm, drawerForm, and overlayForm
  return Object.values(route).filter((val: any): val is FormJson => val.fields);
};

/**
 * Given an array of form fields, iterate through them and all of their children
 */
const iterateFieldsIn = function* (
  formFields: FormField[]
): Generator<FormField, void, undefined> {
  for (let field of formFields) {
    yield field;
    if (field.choices) {
      for (let choice of field.choices) {
        if (choice.children) {
          yield* iterateFieldsIn(choice.children);
        }
      }
    }
    if (field.props && field.props.choices) {
      for (let choice of field.props.choices) {
        if (choice.children) {
          yield* iterateFieldsIn(choice.children);
        }
      }
    }
  }
};

/**
 * Given a form template, iterate through all of the fields with type: "number"
 */
const iterateNumericFieldsInForm = function* (formTemplate: ReportJson) {
  for (let route of iterateRoutesIn(formTemplate.routes)) {
    for (let form of iterateFormsIn(route)) {
      for (let field of iterateFieldsIn(form.fields)) {
        /*
         * We're keying off of field type exclusively, because field validation
         * is a lot more complicated: it may be "number", "numberOptional",
         * "numberNotLessThanZero", { "type": "numberNotLessThanOne" }, and so on.
         * But every field in MCPAR and MLR with number-like validation
         * has type exactly "number" (as of 2023-08-23, anyway).
         */
        if (field.type === "number") {
          yield {
            entityType: route.entityType,
            fieldId: field.id,
          };
        }
      }
    }
  }
};

/**
 * Given a report body and a field, find all values for that field.
 * There may be no values for optional fields,
 * a single value for root-level fields,
 * or multiple values if the field belongs to a repeatable entity.
 */
const getValuesFromReport = function* (
  reportData: AnyObject,
  field: FieldTemplate
) {
  const { entityType, fieldId } = field;
  if (entityType && reportData[entityType]) {
    for (let entity of reportData[entityType]) {
      yield entity[fieldId] as string;
    }
  } else {
    yield reportData[fieldId] as string;
  }
};

/**
 * Scan the entire table for a given report type,
 * and return all reports' metadata.
 */
const getAllReportMetadataForType = async function* (reportType: ReportType) {
  const TableName = reportTables[reportType];
  for await (let reportMetadata of dynamodbLib.scanIterator({ TableName })) {
    yield reportMetadata as ReportMetadata;
  }
};

/**
 * Given a report ID, go and fetch the actual user-entered data from S3
 */
const getReportData = async (report: ReportMetadata) => {
  return (await s3Lib.get({
    Bucket: reportBuckets[report.reportType as ReportType],
    Key: getFieldDataKey(report.state, report.fieldDataId),
  })) as AnyObject;
};

/**
 * Decorate report metadata with contact info and suchlike.
 */
const enhanceMetadata = (metadata: ReportMetadata, reportData: AnyObject) => {
  return {
    ...metadata,
    reportingPeriodStartDate: reportData.reportingPeriodStartDate as string,
    reportingPeriodEndDate: reportData.reportingPeriodEndDate as string,
    programName: reportData.programName as string,
    contactName: reportData.contactName as string,
    contactEmailAddress: reportData.contactEmailAddress as string,
  };
};

const formatResultsAsTable = (reportsToFix: ExtractResult[]) => {
  const rank = (level: FormatLevel) =>
    (["good", "fixable", "bad"] as const).indexOf(level);

  const worstLevel = (result: ExtractResult) =>
    result.fields
      .map((f) => f.level)
      .reduce((worst, x) => (rank(worst) > rank(x) ? worst : x));

  const reportsWithWorseProblemsFirst = (a: ExtractResult, b: ExtractResult) =>
    rank(worstLevel(b)) - rank(worstLevel(a));

  const headerLine =
    "reportId,reportType,state,programName,contactName,contactEmailAddress,entityType,fieldId,index,value,level\n".replaceAll(
      ",",
      "\t"
    );

  return (
    headerLine +
    reportsToFix
      .sort(reportsWithWorseProblemsFirst)
      .flatMap(({ report, fields }) =>
        fields.map((field) =>
          [
            report.id,
            report.reportType,
            report.state,
            report.programName,
            report.contactName,
            report.contactEmailAddress,
            field.entityType,
            field.fieldId,
            field.index,
            field.value,
            field.level,
          ].join("\t")
        )
      )
      .join("\n")
  );
};
