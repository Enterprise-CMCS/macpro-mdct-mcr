import { render, screen } from "@testing-library/react";
import {
  TopQualityMeasuresSectionV2,
  BottomQualityMeasuresSectionV2,
} from "./QualityMeasuresSectionsV2";
import { testA11yAct } from "utils/testing/commonTests";

const defaultProps = {
  formattedEntityData: {
    name: "Mock Measure Name",
    activities: "Mock activity",
    cmitNumber: "12345",
    dataVersion: "Final",
    identifierType: "Yes",
    identifierUrl: "Not answered, optional",
    measureResults: [
      {
        planName: "mock-plan-1",
        notReporting: true,
      },
      {
        planName: "mock-plan-2",
        dataCollectionMethod: "Administrative",
        rateResults: [
          {
            rate: "mock-rate",
            rateResult: "12345",
          },
        ],
      },
    ],
  },
  printVersion: true,
  isPdf: true,
  sx: {},
};

describe("TopQualityMeasuresSectionV2", () => {
  test("Renders measure details correctly", () => {
    render(<TopQualityMeasuresSectionV2 {...defaultProps} />);
    [
      "D2.VII.2 Measure Name: Mock Measure Name",
      "D2.VII.3 Measure identification number or definition",
      "CMIT: 12345",
      "D2.VII.4 Data version",
      "Final",
      "D2.VII.5 Activities the quality measure is used in",
      "Mock activity",
    ].forEach((text) => {
      expect(screen.getByText(text)).toBeVisible();
    });
  });

  testA11yAct(<TopQualityMeasuresSectionV2 {...defaultProps} />);
});

describe("BottomQualityMeasuresSectionV2", () => {
  test("Renders correctly if plan is not reporting measure results", () => {
    render(<BottomQualityMeasuresSectionV2 {...defaultProps} />);
    expect(screen.getByText("D2.VII.7 Measure results")).toBeInTheDocument();
    expect(screen.getByText("Not reporting:")).toBeInTheDocument();
  });

  testA11yAct(<BottomQualityMeasuresSectionV2 {...defaultProps} />);
});
