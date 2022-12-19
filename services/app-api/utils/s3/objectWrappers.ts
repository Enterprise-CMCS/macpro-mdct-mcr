import { S3 } from "aws-sdk";

export const getObjectWrapper = (
  s3: S3,
  params: { Bucket: string; Key: string }
) => {
  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err: any, result: any) {
      if (err) {
        reject(err);
      }
      if (result) {
        resolve(JSON.parse(result.Body));
      }
    });
  });
};

export const putObjectWrapper = (
  s3: S3,
  params: { Bucket: string; Key: string; Body: string; ContentType: string }
) => {
  return new Promise((resolve, reject) => {
    s3.putObject(params, function (err: any, result: any) {
      if (err) {
        reject(err);
      }
      if (result) {
        resolve(result);
      }
    });
  });
};
