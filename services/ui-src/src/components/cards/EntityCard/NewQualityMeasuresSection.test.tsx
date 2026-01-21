import { render, screen } from "@testing-library/react";
import {
  NewTopQualityMeasuresSection,
  NewBottomQualityMeasuresSection,
} from "./NewQualityMeasuresSection";
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

describe("NewTopQualityMeasuresSection", () => {
  test("Renders measure details correctly", () => {
    render(<NewTopQualityMeasuresSection {...defaultProps} />);
    expect(
      screen.getByText("D2.VII.2 Measure Name: Mock Measure Name")
    ).toBeInTheDocument();
    expect(
      screen.getByText("D2.VII.3 Measure identification number or definition")
    ).toBeInTheDocument();
    expect(screen.getByText("CMIT: 12345")).toBeInTheDocument();
    expect(screen.getByText("D2.VII.4 Data version")).toBeInTheDocument();
    expect(screen.getByText("Final")).toBeInTheDocument();
    expect(
      screen.getByText("D2.VII.5 Activities the quality measure is used in")
    ).toBeInTheDocument();
    expect(screen.getByText("Mock activity")).toBeInTheDocument();
  });

  testA11yAct(<NewTopQualityMeasuresSection {...defaultProps} />);
});

describe("NewBottomQualityMeasuresSection", () => {
  test("Renders correctly if plan is not reporting measure results", () => {
    render(<NewBottomQualityMeasuresSection {...defaultProps} />);
    expect(screen.getByText("D2.VII.7 Measure results")).toBeInTheDocument();
    expect(screen.getByText("Not reporting:")).toBeInTheDocument();
  });

  testA11yAct(<NewBottomQualityMeasuresSection {...defaultProps} />);
});
