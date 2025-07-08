import { copyFieldDataFromSource, makePCCMModifications } from "./reports";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { mockReportJson } from "../../utils/testing/setupJest";
import s3Lib from "../s3/s3-lib";
// types
import { ReportType } from "../../utils/types";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

describe("copyFieldDataFromSource()", () => {
  describe("MCPAR", () => {
    test("Test makePCCMModifications sets correct field data", () => {
      let testFieldData = {};
      testFieldData = makePCCMModifications(testFieldData);
      expect(testFieldData).toEqual({
        program_type: [
          {
            key: "program_type-atiwcA9QUE2eoTchV2ZLtw", // pragma: allowlist secret
            value: "Primary Care Case Management (PCCM) Entity",
          },
        ],
      });
    });
  });

  describe("MLR", () => {
    test("returns validatedField data", async () => {
      const res = await copyFieldDataFromSource(
        "database-local-mlr",
        "Minnesota",
        "mockReportJson",
        mockReportJson,
        { stateName: "Minnesota" },
        ReportType.MLR
      );
      expect(res).toEqual({ stateName: "Minnesota" });
    });
  });

  describe("NAAAR", () => {
    test("uses S3 object for validatedField data", async () => {
      dynamoClientMock.on(QueryCommand).resolves({
        Items: [],
      });
      jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
        stateName: "Alabama",
        plans: [{ id: "foo", name: "name", notAllowed: "false" }],
      });
      const res = await copyFieldDataFromSource(
        "database-local-naaar",
        "Minnesota",
        "mockReportJson",
        mockReportJson,
        { stateName: "Minnesota" },
        ReportType.NAAAR
      );
      expect(res).toEqual({
        stateName: "Minnesota",
        plans: [{ id: "foo", name: "name" }],
      });
    });

    test("returns validatedField data if no S3 object", async () => {
      dynamoClientMock.on(QueryCommand).resolves({
        Items: [],
      });
      jest.spyOn(s3Lib, "get").mockResolvedValueOnce(undefined);
      const res = await copyFieldDataFromSource(
        "database-local-naaar",
        "Minnesota",
        "mockReportJson",
        mockReportJson,
        { stateName: "Minnesota" },
        ReportType.NAAAR
      );
      expect(res).toEqual({ stateName: "Minnesota" });
    });
  });
});
