import {
  copyFieldDataFromSource,
  makePCCMModifications,
  populateQualityMeasures,
} from "./reports";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { mockReportJson } from "../../utils/testing/setupJest";
import s3Lib from "../s3/s3-lib";
// types
import { ReportJson, ReportType } from "../../utils/types";
import { uuidRegex } from "../constants/constants";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

const mockReportQualityMeasuresJson: ReportJson = {
  ...mockReportJson,
  entities: {},
};
mockReportQualityMeasuresJson.routes.push({
  name: "mock-route-1",
  path: "/mock/mock-route-1",
  pageType: "standard",
  verbiage: { intro: { section: "" } },
  form: {
    id: "mock-form-id",
    fields: [
      {
        id: "measure_name",
        type: "text",
        validation: "text",
        props: {
          label: "mock measure name",
        },
      },
    ],
  },
});

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

    test("Test populateQualityMeasures sets correct field data", () => {
      let testFieldData = {};
      testFieldData = populateQualityMeasures(
        testFieldData,
        "MN",
        "Minnesota Senior Health Options (MSHO)"
      );
      expect(testFieldData).toEqual({
        qualityMeasures: [
          {
            id: expect.stringMatching(uuidRegex),
            measure_name: "MSHO measure 1",
          },
        ],
      });
    });

    test("returns new quality measures copyover", async () => {
      dynamoClientMock.on(QueryCommand).resolves({
        Items: [],
      });
      jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
        stateName: "Minnesota",
        qualityMeasures: [{ id: "foo", measure_name: "name" }],
      });
      const res = await copyFieldDataFromSource(
        "database-local-mcpar",
        "Minnesota",
        "mockReportQualityMeasuresJson",
        mockReportQualityMeasuresJson,
        { stateName: "Minnesota" },
        ReportType.MCPAR,
        true // newQualityMeasuresSectionEnabled
      );
      expect(res).toEqual({
        stateName: "Minnesota",
        qualityMeasures: [
          {
            id: "foo",
            measure_name: "name",
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
