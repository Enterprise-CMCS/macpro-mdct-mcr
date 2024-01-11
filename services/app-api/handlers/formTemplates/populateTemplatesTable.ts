import s3Lib from "../../utils/s3/s3-lib";
import { ReportJson } from "../../utils/types";

/**
 * Retrieve template data from S3
 *
 * @param bucket s3 bucket
 * @param key s3 key
 * @returns s3 object body
 */
export async function getTemplate(bucket: string, key: string) {
  return (await s3Lib.get({
    Key: key,
    Bucket: bucket,
  })) as ReportJson;
}
