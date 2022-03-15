const AWS = require("aws-sdk");
const dyanmoConfig = {};

// ugly but OK, here's where we will check the environment
const endpoint = process.env.DYNAMODB_URL;
if (endpoint) {
  dyanmoConfig.endpoint = endpoint;
  dyanmoConfig.accessKeyId = "LOCAL_FAKE_KEY"; // pragma: allowlist secret
  dyanmoConfig.secretAccessKey = "LOCAL_FAKE_SECRET"; // pragma: allowlist secret
} else {
  dyanmoConfig["region"] = "us-east-1";
}

const client = new AWS.DynamoDB.DocumentClient(dyanmoConfig);

module.exports = {
  scan: (params) => client.scan(params).promise(),
};
