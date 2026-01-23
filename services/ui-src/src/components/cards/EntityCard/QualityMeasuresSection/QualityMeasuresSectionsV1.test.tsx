import { render, screen } from "@testing-library/react";
import {
  TopQualityMeasuresSectionV1,
  BottomQualityMeasuresSectionV1,
} from "./QualityMeasuresSectionsV1";
import { testA11yAct } from "utils/testing/commonTests";

const defaultProps = {
  formattedEntityData: {
    name: "Mock Measure Name",
    domain: "Mock Measure Domain",
    nqfNumber: "12345",
    reportingRateType: "Mock Reporting Rate Type",
    set: "Mock Measure Set",
    reportingPeriod: "Mock Reporting Period",
    description: "Mock Description",
    perPlanResponses: [
      {
        name: "mock-plan-1",
        response: "mock-response-1",
      },
      {
        name: "mock-plan-2",
        response: "mock-response-2",
      },
    ],
  },
  printVersion: true,
  isPdf: true,
  sx: {},
};

describe("TopQualityMeasuresSectionV1", () => {
  test("Renders measure details correctly", () => {
    render(<TopQualityMeasuresSectionV1 {...defaultProps} />);
    [
      "D2.VII.1 Measure Name: Mock Measure Name",
      "D2.VII.2 Measure Domain",
      "Mock Measure Domain",
      "D2.VII.3 National Quality Forum (NQF) number",
      "12345",
      "D2.VII.4 Measure Reporting and D2.VII.5 Programs",
      "Mock Reporting Rate Type",
      "D2.VII.6 Measure Set",
      "Mock Measure Set",
      "D2.VII.7a Reporting Period and D2.VII.7b Reporting period: Date range",
      "Mock Reporting Period",
      "D2.VII.8 Measure Description",
      "Mock Description",
    ].forEach((text) => {
      expect(screen.getByText(text)).toBeVisible();
    });
  });

  testA11yAct(<TopQualityMeasuresSectionV1 {...defaultProps} />);
});

describe("BottomQualityMeasuresSectionV2", () => {
  test("Renders correctly if plan is not reporting measure results", () => {
    render(<BottomQualityMeasuresSectionV1 {...defaultProps} />);
    expect(screen.getByText("Measure results")).toBeVisible();
    expect(screen.getByText("mock-plan-1")).toBeVisible();
  });

  testA11yAct(<BottomQualityMeasuresSectionV1 {...defaultProps} />);
});
