import KafkaSourceLib from "./kafka-source-lib";
import s3Lib from "../s3/s3-lib";

let tempStage: string | undefined;
let tempNamespace: string | undefined;
let tempBrokers: string | undefined;

const mockSendBatch = jest.fn();
const mockProducer = jest.fn().mockImplementation(() => {
  return {
    disconnect: () => {},
    removeListener: () => {},
    connect: () => {},
    sendBatch: mockSendBatch,
  };
});

jest.mock("kafkajs", () => ({
  Kafka: () => ({
    producer: mockProducer,
  }),
}));

const stage = "testing";
const namespace = "--mcr--test-stage--";
const table = { sourceName: `${stage}-aTable`, topicName: "aTable-reports" };
const bucket = {
  sourceName: `database-${stage}-aBucket`,
  topicName: "aBucket-forms",
};
const brokerString = "brokerA,brokerB,brokerC";
const dynamoEvent = {
  Records: [
    {
      eventID: "2",
      eventName: "MODIFY",
      eventVersion: "1.0",
      eventSource: "aws:dynamodb",
      awsRegion: "us-east-1",
      dynamodb: {
        Keys: {
          Id: {
            N: "101",
          },
        },
        NewImage: {
          Message: {
            S: "This item has changed",
          },
          Id: {
            N: "101",
          },
        },
        OldImage: {
          Message: {
            S: "New item!",
          },
          Id: {
            N: "101",
          },
        },
        SequenceNumber: "222",
        SizeBytes: 59,
        StreamViewType: "NEW_AND_OLD_IMAGES",
      },
      eventSourceARN: `somePrefix/${table.sourceName}/someSuffix`,
    },
  ],
};
const s3Event = {
  Records: [
    {
      eventVersion: "2.2",
      eventSource: "aws:s3",
      awsRegion: "us-west-2",
      eventTime:
        "The time, in ISO-8601 format, for example, 1970-01-01T00:00:00.000Z, when Amazon S3 finished processing the request",
      eventName: "event-type",
      s3: {
        s3SchemaVersion: "1.0",
        configurationId: "ID found in the bucket notification configuration",
        bucket: {
          name: "bucket-name",
          ownerIdentity: {
            principalId: "Amazon-customer-ID-of-the-bucket-owner",
          },
          arn: `somePrefix:${bucket.sourceName}/someSuffix`,
        },
        object: {
          key: "fieldData/mockReportFieldData.json", // NOTE KEY FORMAT
          size: "object-size in bytes",
          eTag: "object eTag",
          versionId:
            "object version if bucket is versioning-enabled, otherwise null",
          sequencer:
            "a string representation of a hexadecimal value used to determine event sequence, only used with PUTs and DELETEs",
        },
      },
    },
  ],
};

const s3IgnoredEvent = {
  Records: [
    {
      eventVersion: "2.2",
      eventSource: "aws:s3",
      awsRegion: "us-west-2",
      eventTime:
        "The time, in ISO-8601 format, for example, 1970-01-01T00:00:00.000Z, when Amazon S3 finished processing the request",
      eventName: "event-type",
      s3: {
        s3SchemaVersion: "1.0",
        configurationId: "ID found in the bucket notification configuration",
        bucket: {
          name: "bucket-name",
          ownerIdentity: {
            principalId: "Amazon-customer-ID-of-the-bucket-owner",
          },
          arn: `somePrefix:${bucket.sourceName}/someSuffix`,
        },
        object: {
          key: "object-key", // IGNORED DUE TO KEY
          size: "object-size in bytes",
          eTag: "object eTag",
          versionId:
            "object version if bucket is versioning-enabled, otherwise null",
          sequencer:
            "a string representation of a hexadecimal value used to determine event sequence, only used with PUTs and DELETEs",
        },
      },
    },
  ],
};

describe("Test Kafka Lib", () => {
  beforeAll(() => {
    tempStage = process.env.STAGE;
    tempNamespace = process.env.topicNamespace;
    tempBrokers = process.env.BOOTSTRAP_BROKER_STRING_TLS;

    process.env.STAGE = stage;
    process.env.topicNamespace = namespace;
    process.env.BOOTSTRAP_BROKER_STRING_TLS = brokerString;
  });
  afterAll(() => {
    process.env.STAGE = tempStage;
    process.env.topicNamespace = tempNamespace;
    process.env.BOOTSTRAP_BROKER_STRING_TLS = tempBrokers;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Handles a dynamo event", async () => {
    const sourceLib = new KafkaSourceLib("mcr", "v0", [table], [bucket]);
    await sourceLib.handler(dynamoEvent);
    expect(mockSendBatch).toBeCalledTimes(1);
  });

  test("Processes bucket events", async () => {
    const s3GetSpy = jest.spyOn(s3Lib, "get");
    s3GetSpy.mockResolvedValue("response object");
    const sourceLib = new KafkaSourceLib("mcr", "v0", [table], [bucket]);
    await sourceLib.handler(s3Event);
    expect(s3GetSpy).toHaveBeenCalled();
    expect(mockSendBatch).toBeCalledTimes(1);
  });

  test("Handles events without versions", async () => {
    const sourceLib = new KafkaSourceLib("mcr", null, [table], [bucket]);
    await sourceLib.handler(dynamoEvent);
    expect(mockSendBatch).toBeCalledTimes(1);
  });

  test("Does not pass through events from unrelated tables or buckets", async () => {
    const badMaps = [{ sourceName: "bad", topicName: "bad" }];
    const sourceLib = new KafkaSourceLib(
      "mcr",
      "v0",
      [{ sourceName: "unrelated-table", topicName: "unrelated-topic" }],
      badMaps
    );
    await sourceLib.handler(s3Event);
    await sourceLib.handler(dynamoEvent);
    expect(mockSendBatch).toBeCalledTimes(0);
  });

  test("Ignores items with bad keys or missing events", async () => {
    const sourceLib = new KafkaSourceLib("mcr", "v0", [table], [bucket]);
    await sourceLib.handler(s3IgnoredEvent);
    await sourceLib.handler({});
    expect(mockSendBatch).toBeCalledTimes(0);
  });

  test("Handles dynamo events with no OldImage", async () => {
    const dynamoInsertEvent = {
      Records: [
        {
          eventSourceARN: `/${table.sourceName}/`,
          eventID: "test-event-id",
          eventName: "INSERT",
          dynamodb: {
            Keys: { foo: { S: "bar" } },
            NewImage: { foo: { S: "bar" } },
            StreamViewType: "NEW_AND_OLD_IMAGES",
          },
        },
      ],
    };
    const sourceLib = new KafkaSourceLib("mcr", "v0", [table], []);
    await sourceLib.handler(dynamoInsertEvent);
    expect(mockSendBatch).toBeCalledWith({
      topicMessages: [
        {
          messages: [
            expect.objectContaining({
              headers: {
                eventID: "test-event-id",
                eventName: "INSERT",
              },
              key: "bar",
              value: `{"NewImage":{"foo":"bar"},"OldImage":{},"Keys":{"foo":"bar"}}`,
            }),
          ],
          topic: "--mcr--test-stage--mcr.aTable-reports.v0",
        },
      ],
    });
  });
});
