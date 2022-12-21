//STORING CODE HERE, WILL NEED TO REFACTOR INTO PROPER HANDLER USING S3 V2
/* eslint-disable */
const {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const KSUID = require("ksuid");

const awsConfig = {
  local: {
    s3Bucket: "local-mcpar-form",
    dynamoTable: "main-mcpar-reports",
    awsAccountId: "446712541566",
    clientConfig: {
      endpoint: "http://localhost:4569",
      region: "localhost",
      s3ForcePathStyle: true,
      accessKeyId: "LOCAL_FAKE_KEY", // pragma: allowlist secret
      secretAccessKey: "LOCAL_FAKE_SECRET", // pragma: allowlist secret
    },
  },
  dev: {
    s3Bucket: "database-main-mcpar-446712541566",
    dynamoTable: "main-mcpar-reports",
    awsAccountId: "446712541566",
    clientConfig: {
      region: "us-east-1",
      profile: "446712541566_ct-ado-mdctmcr-developer-admin",
    },
  },
  val: {},
  prod: {},
};

var currentConfig = awsConfig.dev;

const dynamoClient = new DynamoDBClient(currentConfig.clientConfig);
const s3Client = new S3Client(currentConfig.clientConfig);

const scanTable = async () => {
  const dbParams = {
    KeyConditions: "",
    TableName: currentConfig.dynamoTable,
  };
  const command = new ScanCommand(dbParams);

  var items;
  do {
    items = await dynamoClient.send(command);
    items.Items.forEach((report) => {
      processReport(report);
    });
    dbParams.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== "undefined");
};

const processReport = (report) => {
  const formTemplate = report.formTemplate?.M;
  const fieldData = report.fieldData?.M;
  if (!formTemplate || !fieldData) {
    console.error("Report doesn't have fieldData or formTemplate", {
      state: report.state,
      id: report.id,
    });
    return;
  }
  const formTemplateId = KSUID.randomSync().string;
  const fieldDataId = KSUID.randomSync().string;

  try {
    writeToS3("formTemplates", report.state, formTemplateId, formTemplate);
    report.formTemplateId = { S: formTemplateId };
    delete report.formTemplate;

    writeToS3("fieldData", report.state, fieldDataId, fieldData);
    report.fieldDataId = { S: fieldDataId };
    delete report.fieldData;
    writeToDynamo(report);
  } catch (err) {
    console.error(
      "Unable to write s3 record",
      { state: report.state, id: report.id },
      err
    );
  }
};

const writeToDynamo = async (report) => {
  const params = {
    TableName: currentConfig.dynamoTable,
    Item: { ...report },
  };

  const command = new PutItemCommand(params);
  await dynamoClient.send(command);
};

const writeToS3 = async (directory, state, name, data) => {
  const bucketParams = {
    Bucket: currentConfig.s3Bucket,
    Key: `${directory}/${state}/${name}.json`,
    Body: JSON.stringify(data),
  };

  const command = new PutObjectCommand(bucketParams);
  await s3Client.send(command);
};

scanTable();
