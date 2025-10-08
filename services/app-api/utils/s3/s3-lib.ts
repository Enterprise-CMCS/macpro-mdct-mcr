import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandInput,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { logger } from "../debugging/debug-lib";
import { buckets, error } from "../constants/constants";
import { State } from "../types/other";

export const awsConfig = {
  region: "us-east-1",
  logger,
  endpoint: process.env.AWS_ENDPOINT_URL,
  forcePathStyle: true,
};

const client = new S3Client(awsConfig);

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
};

export function getFieldDataKey(state: State, fieldDataId: string) {
  return `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`;
}

export function getFormTemplateKey(formTemplateId: string) {
  return `${buckets.FORM_TEMPLATE}/${formTemplateId}.json`;
}
