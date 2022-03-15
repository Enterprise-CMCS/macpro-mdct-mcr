import { Storage } from "aws-amplify";
import AWS, { S3 } from "aws-sdk";
import config from "config";
import { S3Key } from "aws-sdk/clients/codedeploy";

export async function s3AmplifyUpload(file: File): Promise<string> {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
  });

  return stored.key;
}

export function s3LocalUploader(s3Client: S3): any {
  return async function (file: File) {
    const filename = `${Date.now()}-${file.name}`;

    return new Promise((resolve, reject) => {
      s3Client.putObject(
        {
          Key: filename,
          Body: file,
          Bucket: "", // Typescript asks for a property "bucket" string type here will have to revisit
        },
        (err: Error) => {
          if (err) {
            reject(err);
          }
          resolve(filename);
        }
      );
    });
  };
}

// In Amplify you call get to get a url to the given resource
export async function s3AmplifyGetURL(s3key: S3Key): Promise<string> {
  return Storage.vault.get(s3key);
}

// locally we do what
export function s3LocalGetURL(s3Client: S3): any {
  return function (s3key: S3Key) {
    var params = { Key: s3key };
    return s3Client.getSignedUrl("getObject", params);
  };
}

export function enableLocalS3(shouldEnable: boolean) {
  if (shouldEnable) {
    // Local Login
    const localLogin = config.LOCAL_LOGIN === "true";
    // Local s3
    const localEndpoint = config.s3.LOCAL_ENDPOINT;
    let s3Upload = s3AmplifyUpload;
    let s3URLResolver = s3AmplifyGetURL;
    if (localLogin && localEndpoint !== "") {
      // Amplify doesn't allow you to configure the AWS Endpoint, so for local dev we need our own S3Client configured.
      let s3Client = new AWS.S3({
        s3ForcePathStyle: true,
        apiVersion: "2006-03-01",
        accessKeyId: "S3RVER", // This specific key is required when working offline   pragma: allowlist secret
        secretAccessKey: "S3RVER", // pragma: allowlist secret
        params: { Bucket: config.s3.BUCKET },
        endpoint: new AWS.Endpoint(localEndpoint),
      });
      s3Upload = s3LocalUploader(s3Client);
      s3URLResolver = s3LocalGetURL(s3Client);
      return { s3Upload, s3URLResolver };
    }
  }
  return undefined;
}
