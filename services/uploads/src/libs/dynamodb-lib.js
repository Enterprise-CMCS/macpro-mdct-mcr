const AWS = require("aws-sdk");
const dynamoConfig = {};

// ugly but OK, here's where we will check the environment
const endpoint = process.env.DYNAMODB_URL;
if (endpoint) {
  dynamoConfig.endpoint = endpoint;
  dynamoConfig.accessKeyId = "LOCAL_FAKE_KEY"; // pragma: allowlist secret
  dynamoConfig.secretAccessKey = "LOCAL_FAKE_SECRET"; // pragma: allowlist secret
} else {
  dynamoConfig["region"] = "us-east-1";
}

const client = new AWS.DynamoDB.DocumentClient(dynamoConfig);

module.exports = {
  scan: (params) => client.scan(params).promise(),
};
