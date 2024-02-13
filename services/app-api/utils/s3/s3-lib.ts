import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandInput,
  GetObjectCommand,
  GetObjectRequest,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "../debugging/debug-lib";
import { buckets, error } from "../constants/constants";
import { State } from "../types/other";

const localConfig = {
  endpoint: process.env.S3_LOCAL_ENDPOINT,
  region: "localhost",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "S3RVER", // pragma: allowlist secret
    secretAccessKey: "S3RVER", // pragma: allowlist secret
  },
  logger,
};

const awsConfig = {
  region: "us-east-1",
  logger,
};

export const getConfig = () => {
  return process.env.S3_LOCAL_ENDPOINT ? localConfig : awsConfig;
};
const client = new S3Client(getConfig());

export default {
  put: async (params: PutObjectCommandInput) =>
    await client.send(new PutObjectCommand(params)),
  get: async (params: GetObjectCommandInput) => {
    try {
      const response = await client.send(new GetObjectCommand(params));
      const stringBody = await response.Body?.transformToString();
      if (stringBody) {
        return JSON.parse(stringBody);
      } else {
        throw new Error();
      }
    } catch {
      throw new Error(error.S3_OBJECT_GET_ERROR);
    }
  },
  getSignedDownloadUrl: async (params: GetObjectRequest) => {
    return await getSignedUrl(client, new GetObjectCommand(params), {
      expiresIn: 3600,
    });
  },
};

export function getFieldDataKey(state: State, fieldDataId: string) {
  return `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`;
}

export function getFormTemplateKey(formTemplateId: string) {
  return `${buckets.FORM_TEMPLATE}/${formTemplateId}.json`;
}
