import { Credentials, S3, Endpoint } from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import { buckets } from "../constants/constants";
import { S3Get, S3Put, State } from "../types/other";

export const createS3Client = () => {
  const s3Config: S3.ClientConfiguration &
    ServiceConfigurationOptions &
    S3.ClientApiVersions = {};

  const endpoint = process.env.S3_LOCAL_ENDPOINT;
  if (endpoint) {
    // We are working locally for testing, so set up appropriately
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
    return new Promise<void>((resolve, reject) => {
      s3Client.putObject(params, function (err: any, result: any) {
        if (err) {
          reject(err);
        }
        if (result) {
          resolve();
        }
      });
    });
  },
  get: async (params: S3Get) => {
    return new Promise((resolve, reject) => {
      s3Client.getObject(params, function (err: any, result: any) {
        if (err) {
          reject(err);
        }
        if (result) {
          resolve(JSON.parse(result.Body));
        }
      });
    });
  },
  copy: async (params: S3.CopyObjectRequest) => {
    return new Promise<void>((resolve, reject) => {
      s3Client.copyObject(params, function (err: any, result: any) {
        if (err) {
          reject(err);
        }
        if (result) {
          resolve();
        }
      });
    });
  },
  list: async (params: S3.ListObjectsV2Request) => {
    let continuationToken: S3.Token | undefined;
    const s3Objects: S3.ObjectList = [];

    do {
      const response = await new Promise<S3.ListObjectsV2Output>(
        (resolve, reject) => {
          s3Client.listObjectsV2(
            { ...params, ContinuationToken: continuationToken },
            function (err: any, result: S3.ListObjectsV2Output) {
              if (err) {
                reject(err);
              }
              if (result) {
                resolve(result);
              }
            }
          );
        }
      );
      if (response.Contents) {
        s3Objects.push(...response.Contents);
      }
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return s3Objects;
  },
};

export function getFieldDataKey(state: State, fieldDataId: string) {
  return `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`;
}

export function getFormTemplateKey(formTemplateId: string) {
  return `${buckets.FORM_TEMPLATE}/${formTemplateId}.json`;
}
