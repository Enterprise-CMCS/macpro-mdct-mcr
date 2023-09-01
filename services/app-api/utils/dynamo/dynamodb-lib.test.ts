import dynamoLib, { createDbClient } from "./dynamodb-lib";
import { DynamoDB } from "aws-sdk";

const mockPromiseCall = jest.fn();

const mockScan = jest
  .fn()
  .mockImplementation(
    async (params: { TableName: string; ExclusiveStartKey: any }) => {
      if (params.TableName !== "testTable") {
        throw new Error(
          `TableName ${params.TableName} was not defined in the mock!`
        );
      }
      if (typeof params.ExclusiveStartKey === "undefined") {
        return { Items: ["zero", "one", "two"], LastEvaluatedKey: 2 };
      } else if (params.ExclusiveStartKey === 2) {
        return { Items: ["three"], LastEvaluatedKey: 3 };
      } else if (params.ExclusiveStartKey === 3) {
        return { Items: ["four", "five"], LastEvaluatedKey: undefined };
      } else {
        throw new Error(
          `ExclusiveStartKey ${params.ExclusiveStartKey} was not defined in the mock!`
        );
      }
    }
  );

jest.mock("aws-sdk", () => ({
  __esModule: true,
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation((_config) => {
      return {
        get: (_x: any) => ({ promise: mockPromiseCall }),
        put: (_x: any) => ({ promise: mockPromiseCall }),
        query: (_x: any) => ({ promise: mockPromiseCall }),
        scan: (x: any) => ({ promise: async () => mockScan(x) }),
        update: (_x: any) => ({ promise: mockPromiseCall }),
        delete: (_x: any) => ({ promise: mockPromiseCall }),
      };
    }),
  },
  Credentials: jest.fn().mockImplementation(() => {
    return {
      accessKeyId: "LOCAL_FAKE_KEY", // pragma: allowlist secret
      secretAccessKey: "LOCAL_FAKE_SECRET", // pragma: allowlist secret
    };
  }),
}));

describe("Test DynamoDB Interaction API Build Structure", () => {
  test("API structure should be callable", () => {
    const testKeyTable = {
      Key: { key: "testKey" },
      TableName: "testTable",
    };
    const testItem = {
      key: "dynamoKey",
      createdAt: Date.now(),
      lastAltered: Date.now(),
      lastAlteredBy: `event.headers["cognito-identity-id"]`,
      data: {},
    };
    dynamoLib.query(true);
    dynamoLib.get(testKeyTable);
    dynamoLib.delete(testKeyTable);
    dynamoLib.put({ TableName: "testTable", Item: testItem });
    dynamoLib.scan({
      ...testKeyTable,
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    });
    dynamoLib.update({
      ...testKeyTable,
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    });

    expect(mockPromiseCall).toHaveBeenCalledTimes(5);
    expect(mockScan).toHaveBeenCalledTimes(1);
  });

  describe("Checking Environment Variable Changes", () => {
    test("Check if statement with DYNAMODB_URL undefined", () => {
      process.env = { ...process.env, DYNAMODB_URL: undefined };
      jest.resetModules();

      createDbClient();
      expect(DynamoDB.DocumentClient).toHaveBeenCalledWith({
        region: "us-east-1",
      });
    });

    test("Check if statement with DYNAMODB_URL set", () => {
      process.env = { ...process.env, DYNAMODB_URL: "endpoint" };
      jest.resetModules();

      createDbClient();
      expect(DynamoDB.DocumentClient).toHaveBeenCalledWith({
        endpoint: "endpoint",
        credentials: {
          accessKeyId: "LOCAL_FAKE_KEY", // pragma: allowlist secret
          secretAccessKey: "LOCAL_FAKE_SECRET", // pragma: allowlist secret
        },
      });
    });
  });
});

describe("Dynamo lib scanTable", () => {
  it("should iterate through multiple scan batches if needed", async () => {
    const scanTableResults: any[] = [];
    for await (let item of dynamoLib.scanIterator({ TableName: "testTable" })) {
      scanTableResults.push(item);
    }

    expect(scanTableResults).toEqual([
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
    ]);
  });
});
