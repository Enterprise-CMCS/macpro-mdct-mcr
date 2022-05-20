import { convertToDynamoExpression } from "../convertToDynamoExpressionVars";

describe("Test Convert To Dynamo Expression", () => {
  test('Test "post" object expression with one attribute key', () => {
    const testObject = convertToDynamoExpression({ test: "TEST" }, "post");
    expect(testObject.UpdateExpression).toBeDefined();
    expect(testObject.UpdateExpression).toContain("#test=:test");
  });

  test('Test "post" object expression with multiple attribute keys', () => {
    const testObject = convertToDynamoExpression(
      { test: "TEST", test2: "TEST" },
      "post"
    );
    expect(testObject.UpdateExpression).toBeDefined();
    expect(testObject.UpdateExpression).toContain("#test=:test, #test2=:test2");
  });

  test('Test "list" object expression', () => {
    const testObject = convertToDynamoExpression(
      { test: "TEST", test2: "TEST" },
      "list"
    );
    expect(testObject.FilterExpression).toBeDefined();
    expect(testObject.FilterExpression).toContain(
      "#test = :test AND #test2 = :test2"
    );
  });
});
