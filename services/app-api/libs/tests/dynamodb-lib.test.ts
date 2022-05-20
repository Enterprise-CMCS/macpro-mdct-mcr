/* eslint-disable no-unused-vars */
import dynamoLib, { createDbClient } from "../dynamodb-lib";
import AWS from "aws-sdk";

const mockPromiseCall = jest.fn();

jest.mock("aws-sdk", () => ({
  __esModule: true,
  default: {
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation((_config) => {
        return {
          get: (_x: any) => ({ promise: mockPromiseCall }),
          put: (_x: any) => ({ promise: mockPromiseCall }),
          query: (_x: any) => ({ promise: mockPromiseCall }),
          scan: (_x: any) => ({ promise: mockPromiseCall }),
          update: (_x: any) => ({ promise: mockPromiseCall }),
          delete: (_x: any) => ({ promise: mockPromiseCall }),
        };
      }),
    },
  },
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

    expect(mockPromiseCall).toHaveBeenCalledTimes(6);
  });

  describe("Checking Environment Variable Changes", () => {
    test("Check if statement with DYNAMADB_URL undefined", () => {
      process.env = { ...process.env, DYNAMODB_URL: undefined };
      jest.resetModules();

      createDbClient();
      expect(AWS.DynamoDB.DocumentClient).toHaveBeenCalledWith({
        region: "us-east-1",
      });
    });

    test("Check if statement with DYNAMADB_URL set", () => {
      process.env = { ...process.env, DYNAMODB_URL: "endpoint" };
      jest.resetModules();

      createDbClient();
      expect(AWS.DynamoDB.DocumentClient).toHaveBeenCalledWith({
        endpoint: "endpoint",
        accessKeyId: "LOCAL_FAKE_KEY", // pragma: allowlist secret
        secretAccessKey: "LOCAL_FAKE_SECRET", // pragma: allowlist secret
      });
    });
  });
});
