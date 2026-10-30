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
        notReportingReason: [
          {
            key: "mock-key",
            value: "Mock Reason",
          },
        ],
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
    expect(screen.getByText("D2.VII.8 Measure results")).toBeVisible();
    expect(screen.getByText("Not reporting: Mock Reason")).toBeVisible();
  });

  test("Does not apply error class to completed or not-reporting plans", () => {
    const { container } = render(
      <BottomQualityMeasuresSectionV2 {...defaultProps} />
    );
    expect(container.querySelectorAll(".error")).toHaveLength(0);
  });

  test("Applies error class to a reporting plan missing results", () => {
    const props = {
      ...defaultProps,
      formattedEntityData: {
        ...defaultProps.formattedEntityData,
        measureResults: [
          { planName: "mock-plan-missing-method", rateResults: [] },
          {
            planName: "mock-plan-missing-rates",
            dataCollectionMethod: "Administrative",
          },
        ],
      },
    };
    const { container } = render(<BottomQualityMeasuresSectionV2 {...props} />);
    expect(container.querySelectorAll(".error")).toHaveLength(2);
  });

  test("Filters out exempt plans", () => {
    const props = {
      ...defaultProps,
      formattedEntityData: {
        ...defaultProps.formattedEntityData,
        measureResults: [
          { planName: "mock-plan-exempt", exempt: true },
          {
            planName: "mock-plan-reporting",
            dataCollectionMethod: "Administrative",
            rateResults: [{ rate: "mock-rate", rateResult: "12345" }],
          },
        ],
      },
    };
    render(<BottomQualityMeasuresSectionV2 {...props} />);
    expect(screen.queryByText("mock-plan-exempt")).not.toBeInTheDocument();
    expect(screen.getByText("mock-plan-reporting")).toBeVisible();
  });

  testA11yAct(<BottomQualityMeasuresSectionV2 {...defaultProps} />);
});
