import dynamoLib, { getConfig } from "./dynamodb-lib";
import {
  GetCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

describe("Test DynamoDB Interaction API Build Structure", () => {
  let originalUrl: string | undefined;
  beforeAll(() => {
    originalUrl = process.env.DYNAMODB_URL;
  });
  afterAll(() => {
    process.env.DYNAMODB_URL = originalUrl;
  });
  beforeEach(() => {
    dynamoClientMock.reset();
  });
  test("Can query", async () => {
    const mockItem = { foo: "bar" };
    dynamoClientMock.on(QueryCommand).resolves({
      Items: [mockItem],
    });
    const foos = await dynamoLib.query({ TableName: "foos" });

    expect(foos.Items?.[0]).toBe(mockItem);
  });
  test("Can query all", async () => {
    const mockKey = {};
    const mockItem1 = { foo: "bar" };
    const mockItem2 = { foo: "baz" };
    const extraCall = jest.fn();
    dynamoClientMock
      .on(QueryCommand)
      .resolvesOnce({ Items: [mockItem1], LastEvaluatedKey: mockKey })
      .callsFakeOnce((command: QueryCommandInput) => {
        expect(command.ExclusiveStartKey).toBe(mockKey);
        return Promise.resolve({ Items: [mockItem2] });
      })
      .callsFake(extraCall);

    const result = await dynamoLib.queryAll({ TableName: "foos" });

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(mockItem1);
    expect(result[1]).toBe(mockItem2);
    expect(extraCall).not.toHaveBeenCalled();
  });
  test("Can delete", async () => {
    const mockDelete = jest.fn();
    dynamoClientMock.on(DeleteCommand).callsFake(mockDelete);

    await dynamoLib.delete({ TableName: "foos", Key: { id: "fid" } });

    expect(mockDelete).toHaveBeenCalled();
  });
  test("Can get", async () => {
    const mockGet = jest.fn();
    dynamoClientMock.on(GetCommand).callsFake(mockGet);

    await dynamoLib.get({ TableName: "foos", Key: { id: "foo1" } });

    expect(mockGet).toHaveBeenCalled();
  });
});

describe("Checking Environment Variable Changes", () => {
  test("Check if statement with DYNAMODB_URL undefined", () => {
    process.env.DYNAMODB_URL = "mock url";
    const config = getConfig();
    expect(config).toHaveProperty("region", "localhost");
  });

  test("Check if statement with DYNAMODB_URL set", () => {
    delete process.env.DYNAMODB_URL;
    const config = getConfig();
    expect(config).toHaveProperty("region", "us-east-1");
  });
});
