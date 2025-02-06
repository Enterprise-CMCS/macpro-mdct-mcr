import {
  S3Client,
  ListBucketsCommand,
  GetBucketPolicyCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-east-1" });

async function getServerlessBuckets(): Promise<string[]> {
  const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
  return (Buckets || [])
    .map((bucket) => bucket.Name!)
    .filter((name) => name.startsWith("serverless-framework-"));
}

async function getBucketPolicy(bucketName: string): Promise<string | null> {
  try {
    const { Policy } = await s3Client.send(
      new GetBucketPolicyCommand({ Bucket: bucketName })
    );
    return Policy || null;
  } catch (error: any) {
    if (error.name === "NoSuchBucketPolicy") {
      return null;
    }
    throw error;
  }
}

async function enforceHttpsPolicy(bucketName: string) {
  const policy = JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "AllowSSLRequestsOnly",
        Action: "s3:*",
        Effect: "Deny",
        Resource: [
          `arn:aws:s3:::${bucketName}`,
          `arn:aws:s3:::${bucketName}/*`,
        ],
        Condition: {
          Bool: { "aws:SecureTransport": "false" },
        },
        Principal: "*",
      },
    ],
  });

  await s3Client.send(
    new PutBucketPolicyCommand({ Bucket: bucketName, Policy: policy })
  );
  console.log(`Applied HTTPS enforcement policy to bucket: ${bucketName}`); //eslint-disable-line no-console
}

export async function addSlsBucketPolicies() {
  const buckets = await getServerlessBuckets();

  for (const bucket of buckets) {
    const existingPolicy = await getBucketPolicy(bucket);

    if (
      existingPolicy &&
      existingPolicy.includes(`"aws:SecureTransport":"false"`)
    ) {
      console.log(`Bucket ${bucket} already enforces HTTPS.`); //eslint-disable-line no-console
    } else {
      console.log(`Updating policy for bucket: ${bucket}`); //eslint-disable-line no-console
      await enforceHttpsPolicy(bucket);
    }
  }
}

addSlsBucketPolicies();
