import {
  copyFieldDataFromSource,
  makePCCMModifications,
  populateQualityMeasures,
} from "./reports";
// utils
import { mockReportJson } from "../../utils/testing/setupJest";
import s3Lib from "../s3/s3-lib";
import { uuidRegex } from "../constants/constants";
// types
import { ReportJson, ReportType } from "../../utils/types";

describe("reports.ts", () => {
  describe("makePCCMModifications()", () => {
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

  describe("copyFieldDataFromSource()", () => {
    describe("MCPAR", () => {
      const mockMcparJson = {
        ...mockReportJson,
        entities: {
          plans: {
            required: true,
          },
        },
      };
      test("Test copyFieldDataFromSource accepts only those entities in the formTemplate", async () => {
        jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
          stateName: "Alabama",
          plans: [{ id: "foo", name: "name", notAllowed: "false" }],
          bssEntities: [{ id: "bar", name: "name", notAllowed: "false" }],
        });
        const res = await copyFieldDataFromSource(
          "database-local-mcpar",
          "Minnesota",
          "mockReportJson",
          mockMcparJson,
          { stateName: "Minnesota" },
          ReportType.MCPAR
        );
        expect(res).toEqual({
          stateName: "Minnesota",
          plans: [{ id: "foo", name: "name" }],
        });
      });

      describe("Quality Measures", () => {
        const mockReportQualityMeasuresJson: ReportJson = {
          ...mockReportJson,
          entities: {
            qualityMeasures: {
              required: true,
            },
          },
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

        test("filters id only entities on copyover", async () => {
          jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
            stateName: "Minnesota",
            qualityMeasures: [
              { id: "foo", measure_name: "name" },
              { id: "bar" },
              { id: "baz" },
            ],
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
      const mockNaaarJson = {
        ...mockReportJson,
        entities: {
          analysisMethods: {
            required: true,
          },
          plans: {
            required: true,
          },
          standards: {
            required: true,
          },
        },
      };
      test("uses S3 object for validatedField data", async () => {
        jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
          stateName: "Alabama",
          plans: [{ id: "foo", name: "name", notAllowed: "false" }],
        });
        const res = await copyFieldDataFromSource(
          "database-local-naaar",
          "Minnesota",
          "mockReportJson",
          mockNaaarJson,
          { stateName: "Minnesota" },
          ReportType.NAAAR
        );
        expect(res).toEqual({
          stateName: "Minnesota",
          plans: [{ id: "foo", name: "name" }],
        });
      });

      test("returns validatedField data if no S3 object", async () => {
        jest.spyOn(s3Lib, "get").mockResolvedValueOnce(undefined);
        const res = await copyFieldDataFromSource(
          "database-local-naaar",
          "Minnesota",
          "mockReportJson",
          mockNaaarJson,
          { stateName: "Minnesota" },
          ReportType.NAAAR
        );
        expect(res).toEqual({ stateName: "Minnesota" });
      });
    });
  });
});
