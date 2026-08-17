import {
  cleanupOtherTextFields,
  copyFieldDataFromSource,
  getPlansNotExemptFromQualityMeasures,
  getSourceFieldData,
  makePCCMModifications,
  needsPreloadedQualityMeasures,
  populateQualityMeasures,
} from "./reports";
// constants
import { uuidRegex } from "../constants/constants";
import { MN } from "../data/qualityMeasures";
// utils
import { mockReportJson } from "../../utils/testing/setupJest";
import s3Lib from "../s3/s3-lib";
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

    test("Test makePCCMModifications removes other text if copying report", () => {
      let testFieldData = {
        "program_type-otherText": "Other text",
        mockField1: "test does copy",
      };
      testFieldData = makePCCMModifications(testFieldData);
      expect(testFieldData).toEqual({
        program_type: [
          {
            key: "program_type-atiwcA9QUE2eoTchV2ZLtw", // pragma: allowlist secret
            value: "Primary Care Case Management (PCCM) Entity",
          },
        ],
        mockField1: "test does copy",
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
        const mockSourceFieldData = {
          stateName: "Alabama",
          plans: [{ id: "foo", name: "name", notAllowed: "false" }],
          bssEntities: [{ id: "bar", name: "name", notAllowed: "false" }],
        };
        const res = await copyFieldDataFromSource(
          "database-local-mcpar",
          "Minnesota",
          mockSourceFieldData,
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

        test("filters quality measures v1 and id-only entities in copyover", async () => {
          const mockSourceFieldData = {
            stateName: "Minnesota",
            qualityMeasures: [
              { id: "foo", measure_name: "v2 name" },
              { id: "bar", qualityMeasure_name: "v1 name" },
              { id: "baz" },
            ],
          };
          const res = await copyFieldDataFromSource(
            "database-local-mcpar",
            "Minnesota",
            mockSourceFieldData,
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
                measure_name: "v2 name",
              },
            ],
          });
        });
      });
    });

    describe("MLR", () => {
      test("returns validatedField data", async () => {
        const mockSourceFieldData = undefined;
        const res = await copyFieldDataFromSource(
          "database-local-mlr",
          "Minnesota",
          mockSourceFieldData,
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
        const mockSourceFieldData = {
          stateName: "Alabama",
          plans: [{ id: "foo", name: "name", notAllowed: "false" }],
        };
        const res = await copyFieldDataFromSource(
          "database-local-naaar",
          "Minnesota",
          mockSourceFieldData,
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
        const mockSourceFieldData = undefined;
        const res = await copyFieldDataFromSource(
          "database-local-naaar",
          "Minnesota",
          mockSourceFieldData,
          mockNaaarJson,
          { stateName: "Minnesota" },
          ReportType.NAAAR
        );
        expect(res).toEqual({ stateName: "Minnesota" });
      });
    });
  });

  describe("getSourceFieldData()", () => {
    test("returns field data", async () => {
      jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
        stateName: "Minnesota",
        plans: [{ id: "foo", name: "name" }],
      });
      const result = await getSourceFieldData(
        "mockSourceId",
        "database-local-mcpar",
        "Minnesota"
      );

      expect(result).toEqual({
        stateName: "Minnesota",
        plans: [{ id: "foo", name: "name" }],
      });
    });
  });

  describe("needsPreloadedQualityMeasures()", () => {
    test("returns true for new report", () => {
      const mockSourceData = undefined;
      const result = needsPreloadedQualityMeasures(mockSourceData);
      expect(result).toBe(true);
    });

    test("returns true for copied report with quality measures v1", () => {
      const mockSourceData = {
        qualityMeasures: [
          {
            qualityMeasure_name: "v1 name",
          },
        ],
      };
      const result = needsPreloadedQualityMeasures(mockSourceData);
      expect(result).toBe(true);
    });

    test("returns false for copied report with quality measures v2", () => {
      const mockSourceData = {
        qualityMeasures: [
          {
            measure_name: "v2 name",
          },
        ],
      };
      const result = needsPreloadedQualityMeasures(mockSourceData);
      expect(result).toBe(false);
    });
  });

  describe("populateQualityMeasures()", () => {
    test("Test populateQualityMeasures sets correct field data", () => {
      const result = populateQualityMeasures({}, "MN", "PMAP");
      const qualityMeasures = MN.PMAP.map((item) => ({
        ...item,
        id: expect.stringMatching(uuidRegex),
      }));

      expect(result).toEqual({
        qualityMeasures,
      });
    });
  });

  describe("cleanupOtherTextFields()", () => {
    test("removes empty otherText fields", () => {
      const fieldData = {
        program_type: [{ value: "MCO" }],
        "program_type-otherText": "",
        programName: "Test Program",
      };
      const result = cleanupOtherTextFields(fieldData);
      expect(result).toEqual({
        program_type: [{ value: "MCO" }],
        programName: "Test Program",
      });
      expect(result).not.toHaveProperty("program_type-otherText");
    });

    test("keeps non-empty otherText fields", () => {
      const fieldData = {
        program_type: [{ value: "Other, specify" }],
        "program_type-otherText": "Custom program type",
        programName: "Test Program",
      };
      const result = cleanupOtherTextFields(fieldData);
      expect(result).toEqual(fieldData);
    });
  });

  describe("getPlansNotExemptFromQualityMeasures()", () => {
    test("removes exempt plans", () => {
      const plans = [
        {
          id: "mock-active-lan-id-1",
          name: "Active plan 1",
        },
        {
          id: "mock-exempt-plan-id-2",
          name: "Exempt plan 2",
        },
        {
          id: "mock-active-plan-id-2",
          name: "Active plan 2",
        },
        {
          id: "mock-exempt-plan-id-2",
          name: "Exempt plan 2",
        },
      ];
      const exemptPlans = [
        {
          key: "plansExemptFromQualityMeasures-mock-exempt-plan-id-1",
          value: "Exempt plan 1",
        },
        {
          key: "plansExemptFromQualityMeasures-mock-exempt-plan-id-2",
          value: "Exempt plan 2",
        },
      ];
      const filteredPlans = [
        {
          id: "mock-active-lan-id-1",
          name: "Active plan 1",
        },
        {
          id: "mock-active-plan-id-2",
          name: "Active plan 2",
        },
      ];
      const result = getPlansNotExemptFromQualityMeasures(plans, exemptPlans);
      expect(result).toEqual(filteredPlans);
    });
  });
});
