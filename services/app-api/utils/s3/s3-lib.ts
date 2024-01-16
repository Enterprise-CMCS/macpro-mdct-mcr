import {
  S3Client,
  PutObjectRequest,
  PutObjectCommand,
  GetObjectRequest,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "../debugging/debug-lib";
import { buckets } from "../constants/constants";
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
  // TODO: figure this out (not like Body from formTemplates.ts)
  put: async (params: PutObjectRequest) =>
    await client.send(new PutObjectCommand(params)),
  get: async (params: GetObjectRequest) =>
    await client.send(new GetObjectCommand(params)),
  getSignedDownloadUrl: async (params: GetObjectRequest, forcedAws = false) => {
    let myClient = forcedAws ? new S3Client(awsConfig) : client;
    return await getSignedUrl(myClient, new GetObjectCommand(params), {
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
