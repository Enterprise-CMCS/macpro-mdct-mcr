import { number } from "./schemas";

describe("Schemas", () => {
  const goodNumberTestCases = [
    "123",
    "123.00",
    "123..00",
    "1,230",
    "1,2,30",
    "1230",
    "123450123..,,,.123123123123",
    "N/A",
    "Data not available",
  ];
  const badNumberTestCases = ["abc", "N", "", "123:123", "!@#!@%"];

  const testCase = (testCases: Array<string>, expectedReturn: boolean) => {
    for (let testCase of testCases) {
      let test = number().isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  test("Evalulate Number Schema accepting good and bad input", () => {
    testCase(goodNumberTestCases, true);
    testCase(badNumberTestCases, false);
  });
});
