import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import s3Lib from "../../utils/s3/s3-lib";
import { AnyObject, S3Get, S3Put } from "../../utils/types";

import { buckets } from "../../utils/constants/constants";

const BUCKET = process.env.MCPAR_FORM_BUCKET!;
const fileName = "test";
const writeObject = {
  message: "hello world",
};

export const run = async (
  _event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // eslint-disable-next-line no-console
  console.log("bucket: " + BUCKET + ", " + buckets.FIELD_DATA);

  await writeDataToS3(writeObject, BUCKET, buckets.FIELD_DATA);
  let data = await getDataFromS3(BUCKET, buckets.FIELD_DATA);
  if (data) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(data));
  }
  // eslint-disable-next-line no-console
  else console.log("No data found");

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "finished write test",
    }),
  };
};

//extract field data from s3 bucket
export const getDataFromS3 = async (bucket: string, bucketType: string) => {
  const dataParams: S3Get = {
    Bucket: bucket,
    Key: `${bucketType}/${fileName}.json`,
  };
  return (await s3Lib.get(dataParams)) as AnyObject;
};

//load field data back to s3 bucket
export const writeDataToS3 = async (
  data: any,
  bucket: string,
  bucketType: string
) => {
  const dataParams: S3Put = {
    Bucket: bucket,
    Key: `${bucketType}/${fileName}.json`,
    Body: JSON.stringify(data),
    ContentType: "application/json",
  };
  const result = await s3Lib.put(dataParams);
  // eslint-disable-next-line no-console
  console.log("Updated form template ", {
    key: dataParams.Key,
    result,
  });

  return result;
};
