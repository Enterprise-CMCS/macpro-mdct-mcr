/* eslint-disable no-console */
const {
  ListObjectsV2Command,
  PutObjectTaggingCommand,
  S3Client,
} = require("@aws-sdk/client-s3");

let s3Client;

const buildS3Client = () => {
  const s3Config = {
    logger: {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
    },
  };
  const endpoint = process.env.S3_LOCAL_ENDPOINT;
  if (endpoint) {
    s3Config.endpoint = endpoint;
    s3Config.region = "localhost";
    s3Config.forcePathStyle = true;
    s3Config.credentials = {
      accessKeyId: "S3RVER", // pragma: allowlist secret
      secretAccessKey: "S3RVER", // pragma: allowlist secret
    };
  } else {
    s3Config["region"] = "us-east-1";
  }

  s3Client = new S3Client(s3Config);
};

const list = async (params) => {
  let ContinuationToken;
  let contents = [];

  do {
    const command = new ListObjectsV2Command({ ...params, ContinuationToken });
    const result = await s3Client.send(command);
    contents = contents.concat(result.Contents ?? []);
    ContinuationToken = result.ContinuationToken;
  } while (ContinuationToken);

  return contents;
};

const putObjectTag = async (params) =>
  await s3Client.send(new PutObjectTaggingCommand(params));

module.exports = { buildS3Client, list, putObjectTag };
