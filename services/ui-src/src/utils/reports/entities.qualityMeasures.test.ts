import { EntityType } from "types";
import {
  isQualityMeasureV1,
  qualityMeasureV1Status,
  qualityMeasureV2Status,
} from "./entities.qualityMeasures";

describe("utils/reports/entities.qualityMeasures", () => {
  describe("isQualityMeasureV1", () => {
    test("returns true for quality measure V1 data", () => {
      expect(
        isQualityMeasureV1(EntityType.QUALITY_MEASURES, {
          perPlanResponses: [],
        })
      ).toBe(true);
    });

    test("returns false for quality measure V2 data", () => {
      expect(
        isQualityMeasureV1(EntityType.QUALITY_MEASURES, {
          measureResults: [],
        })
      ).toBe(false);
    });

    test("returns false for non-quality-measure entity", () => {
      expect(
        isQualityMeasureV1(EntityType.ACCESS_MEASURES, {
          perPlanResponses: [],
        })
      ).toBe(false);
    });
  });

  describe("qualityMeasureV1Status", () => {
    test("returns completed when all plan responses are present", () => {
      expect(
        qualityMeasureV1Status([{ response: "Yes" }, { response: "No" }])
      ).toEqual({ started: true, completed: true });
    });

    test("returns started but incomplete when only some plans have responses", () => {
      expect(
        qualityMeasureV1Status([{ response: "Yes" }, { response: "" }])
      ).toEqual({ started: true, completed: false });
    });

    test("returns not started and incomplete when no plans have responses", () => {
      expect(
        qualityMeasureV1Status([{ response: "" }, { response: undefined }])
      ).toEqual({ started: false, completed: false });
    });
  });

  describe("qualityMeasureV2Status", () => {
    test("returns completed when all non-exempt plans report valid rates", () => {
      expect(
        qualityMeasureV2Status([
          {
            planName: "Plan A",
            dataCollectionMethod: "Administrative",
            rateResults: [{ rateResult: "123" }],
          },
        ])
      ).toEqual({ started: true, completed: true });
    });

    test("returns completed when plan is not reporting and has reason", () => {
      expect(
        qualityMeasureV2Status([
          {
            planName: "Plan A",
            notReporting: true,
            notReportingReason: [{ value: "Does not apply" }],
          },
        ])
      ).toEqual({ started: true, completed: true });
    });

    test("returns incomplete when one non-exempt plan is missing responses", () => {
      expect(
        qualityMeasureV2Status([
          {
            planName: "Plan A",
            dataCollectionMethod: "Administrative",
            rateResults: [{ rateResult: "123" }],
          },
          {
            planName: "Plan B",
          },
        ])
      ).toEqual({ started: true, completed: false });
    });

    test("ignores exempt plans in completion logic", () => {
      expect(
        qualityMeasureV2Status([
          {
            planName: "Plan A",
            dataCollectionMethod: "Administrative",
            rateResults: [{ rateResult: "123" }],
          },
          {
            planName: "Plan B",
            exempt: true,
          },
        ])
      ).toEqual({ started: true, completed: true });
    });

    test("returns completed when all plans are exempt", () => {
      expect(
        qualityMeasureV2Status([
          {
            planName: "Plan A",
            exempt: true,
          },
        ])
      ).toEqual({ started: false, completed: true });
    });
  });
});
