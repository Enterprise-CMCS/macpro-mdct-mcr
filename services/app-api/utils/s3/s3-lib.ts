import { Credentials, S3, Endpoint } from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import { S3Get, S3Put } from "../types/types";

export const createS3Client = () => {
  const s3Config: S3.ClientConfiguration &
    ServiceConfigurationOptions &
    S3.ClientApiVersions = {};

  const endpoint = process.env.S3_LOCAL_ENDPOINT;
  if (endpoint) {
    //We are working locally for testing, so set up appropriately
    s3Config.endpoint = new Endpoint(endpoint);
    s3Config.region = "localhost";
    s3Config.s3ForcePathStyle = true;
    s3Config.credentials = new Credentials({
      accessKeyId: "S3RVER", // pragma: allowlist secret
      secretAccessKey: "S3RVER", // pragma: allowlist secret
    });
  } else {
    s3Config.region = "us-east-1";
  }
  return new S3(s3Config);
};

const s3Client = createS3Client();

export default {
  put: async (params: S3Put) => {
    return new Promise((resolve, reject) => {
      s3Client.putObject(params, function (err: any, result: any) {
        //console.log({ params, err, result });
        if (err) {
          reject(err);
        }
        if (result) {
          resolve(result);
        }
      });
    });
  },
  get: async (params: S3Get) => {
    return new Promise((resolve, reject) => {
      s3Client.getObject(params, function (err: any, result: any) {
        if (err) {
          // console.log("Get Error", err);
          reject(err);
        }
        if (result) {
          // console.log("Get Result", result);
          resolve(JSON.parse(result.Body));
        }
      });
    });
  },
};
