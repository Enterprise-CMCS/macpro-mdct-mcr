/* eslint-disable no-console */
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
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

type FieldData = {
  fieldId: string;
  value: string;
};

type FieldTemplate = {
  fieldId: string;
  entityType?: string;
};

export const check = async (
  _event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const results: { [key in ReportType]?: FieldData[] } = {};

  try {
    for (const reportType of Object.values(ReportType)) {
      results[reportType] = await extractAllNumericFieldValues(reportType);
    }
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }

  console.log(JSON.stringify(results));
  //await writeStoredDataToS3(results);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "finished write test",
    }),
  };
};

export const extractAllNumericFieldValues = async (reportType: ReportType) => {
  const startTime = performance.now();
  const formTemplateLookup = await getAllTemplatesForReportType(reportType);
  const fieldListLookup = makeFieldListLookup(formTemplateLookup);
  const preprocessingDoneTime = performance.now();
  console.log(
    "Time spent processing form templates:",
    preprocessingDoneTime - startTime
  );

  let totalReportFetchTime = 0;
  let totalReportProcessTime = 0;
  let reportCount = 0;

  let extractedData: FieldData[] = [];
  for await (const metadata of iterateAllReportsOfType(reportType)) {
    const reportStartTime = performance.now();
    const reportData = await getReportData(metadata);
    const reportFetchedTime = performance.now();
    totalReportFetchTime += reportFetchedTime - reportStartTime;
    const numericFieldList = fieldListLookup.get(metadata.formTemplateId);

    if (!numericFieldList) {
      throw new Error(
        `Form template not found for report ${JSON.stringify(metadata)}`
      );
    }

    extractedData = extractedData.concat([
      ...getValuesFromReport(reportData, numericFieldList),
    ]);
    const reportDoneTime = performance.now();
    totalReportProcessTime += reportDoneTime - reportFetchedTime;

    reportCount += 1;
    console.log(
      "Average time to fetch, process:",
      (totalReportFetchTime / reportCount).toFixed(1),
      (totalReportProcessTime / reportCount).toFixed(1)
    );
  }

  return extractedData;
};

const getValuesFromReport = function* (
  reportData: AnyObject,
  fields: FieldTemplate[]
) {
  for (let { fieldId, entityType } of fields) {
    if (entityType && reportData[entityType]) {
      for (let entity of reportData[entityType]) {
        if (entity[fieldId]) {
          yield {
            fieldId,
            value: entity[fieldId] as string,
          };
        }
      }
    } else {
      if (reportData[fieldId]) {
        yield {
          fieldId,
          value: reportData[fieldId] as string,
        };
      }
    }
  }
};

const getNumericFieldIdsFromTemplate = (formTemplate: ReportJson) => {
  const iterateRoutes = function* (
    routes: ReportRoute[]
  ): Generator<ReportRoute, void, undefined> {
    for (let route of routes) {
      yield route;
      if (route.children) {
        yield* iterateRoutes(route.children);
      }
    }
  };

  const isFormJson = (routeProperty: any): routeProperty is FormJson => {
    // Routes can have form, modalForm, drawerForm... but all forms have fields. Use that.
    return routeProperty?.fields;
  };

  const iterateForms = function* (formTemplate: ReportJson) {
    for (let route of iterateRoutes(formTemplate.routes)) {
      for (let possibleForm of Object.values(route)) {
        if (isFormJson(possibleForm)) {
          yield {
            form: possibleForm,
            entityType: route.entityType,
          };
        }
      }
    }
  };

  const iterateFieldsInArray = function* (
    formFields: FormField[]
  ): Generator<FormField, void, undefined> {
    for (let field of formFields) {
      if (field.choices) {
        for (let choice of field.choices) {
          if (choice.children) {
            yield* iterateFieldsInArray(choice.children);
          }
        }
      }
      if (field.props && field.props.choices) {
        for (let choice of field.props.choices) {
          if (choice.children) {
            yield* iterateFieldsInArray(choice.children);
          }
        }
      }
      yield field;
    }
  };

  const iterateNumericFieldsInForm = function* (formTemplate: ReportJson) {
    for (let { form, entityType } of iterateForms(formTemplate)) {
      for (let field of iterateFieldsInArray(form.fields)) {
        /*
         * We're keying off of field type exclusively, because field validation
         * is a lot more complicated: it may be "number", "numberOptional",
         * "numberNotLessThanZero", { "type": "numberNotLessThanOne" }, and so on.
         * But every field in MCPAR and MLR with number-like validation
         * has type exactly "number" (as of 2023-08-23, anyway).
         */
        if (field.type === "number") {
          yield {
            fieldId: field.id,
            entityType,
          };
        }
      }
    }
  };

  return [...iterateNumericFieldsInForm(formTemplate)];
};

const getAllTemplatesForReportType = async (reportType: ReportType) => {
  const templates = new Map<string, ReportJson>();
  // TODO maybe this deserves to be a query instead? OMG do queries paginate? what a nightmare.
  const iterator = dynamodbLib.scanIterator({
    TableName: formTemplateTableName,
    FilterExpression: `reportType = :reportType`,
    ExpressionAttributeValues: {
      ":reportType": reportType,
    },
  });

  const Bucket = reportBuckets[reportType];
  for await (const templateMetadata of iterator) {
    const template = await s3Lib.get({
      Bucket,
      Key: getFormTemplateKey(templateMetadata.id),
    });

    templates.set(templateMetadata.id, template as ReportJson);
  }

  return templates;
};

const makeFieldListLookup = (templates: Map<string, ReportJson>) => {
  return new Map(
    [...templates].map(([formTemplateId, formTemplate]) => [
      formTemplateId,
      getNumericFieldIdsFromTemplate(formTemplate),
    ])
  );
};

const iterateAllReportsOfType = async function* (reportType: ReportType) {
  const TableName = reportTables[reportType];
  for await (let reportMetadata of dynamodbLib.scanIterator({ TableName })) {
    yield reportMetadata as ReportMetadata;
  }
};

const getReportData = async (report: ReportMetadata) => {
  return (await s3Lib.get({
    Bucket: reportBuckets[report.reportType as ReportType],
    Key: getFieldDataKey(report.state, report.fieldDataId),
  })) as AnyObject;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const writeStoredDataToS3 = async (
  data: { [key in ReportType]?: FieldData[] }
) => {
  await s3Lib.put({
    Bucket: reportBuckets["MLR"],
    Key: "fieldData/numberValues.json",
    Body: JSON.stringify(data),
    ContentType: "application/json",
  });
};

const main = async () => {
  console.log("Extract started at", new Date());
  await check(null!, null!);
  console.log("Extract finished at", new Date());
};

main();
