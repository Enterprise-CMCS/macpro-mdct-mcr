import { copyFieldDataFromSource, makePCCMModifications } from "./reports";
// utils
import { mockReportJson } from "../../utils/testing/setupJest";
import s3Lib from "../s3/s3-lib";
// types
import { ReportType } from "../../utils/types";

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
