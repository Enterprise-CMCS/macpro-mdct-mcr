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
  list: async (params: S3.ListObjectsRequest) => {
    return new Promise<S3.ObjectList>((resolve, reject) => {
      s3Client.listObjects(
        params,
        function (err: any, result: S3.ListObjectsOutput) {
          if (err) {
            reject(err);
          }
          if (result) {
            resolve(result.Contents ?? []);
          }
        }
      );
    });
  },
};

export function getFieldDataKey(state: State, fieldDataId: string) {
  return `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`;
}

export function getFormTemplateKey(formTemplateId: string, state?: State) {
  if (state) {
    /*
     * TODO: once the dust has settled from the form template refactor epic (MDCT-2600)
     * delete this branch. Form templates are no longer state-specific.
     */
    return `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`;
  } else {
    return `${buckets.FORM_TEMPLATE}/${formTemplateId}.json`;
  }
}

export function getFormTemplateKeyV2(formTemplateId: string) {
  return `${buckets.FORM_TEMPLATE}/${formTemplateId}.json`;
}
