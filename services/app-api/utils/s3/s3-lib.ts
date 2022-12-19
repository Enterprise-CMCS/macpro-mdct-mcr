import { Credentials, S3, Endpoint } from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";

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

export default {
  put: async (params: s3Params) => {
    return new Promise((resolve, reject) => {
      const s3Client = createS3Client();
      s3Client.putObject(params, function (err: any, result: any) {
        //console.log({ err, result });
        if (err) {
          //console.error("Put Error", err);
          reject(err);
        }
        if (result) {
          //console.log("Put Result", result);
          resolve(result);
        }
      });
    });
  },
  get: async () => {
    //console.log("TODO GET", params.Bucket);
  },
};

export interface s3Params {
  Bucket: string;
  Key: string;
  Body?: string;
  ContentType: string;
}
