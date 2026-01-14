import React from "react";
import { render, screen } from "@testing-library/react";
import { QualityMeasuresSection } from "./QualityMeasuresSection";
import {
  mockNotAnswered,
  mockQualityMeasuresData,
} from "utils/testing/mockEntities";
import { testA11yAct } from "utils/testing/commonTests";

const mockSx = {
  heading: {},
  subtitle: {},
  subtext: {},
  grid: {},
  unfinishedMessage: {},
  resultsHeader: {},
  missingResponseMessage: {},
  highlightContainer: {},
  highlightSection: {},
  qualityMeasuresPlanName: {},
  notAnswered: {},
};

const mockVerbiage = {
  entityMissingResponseMessage: "Missing responses message",
  entityEmptyResponseMessage: "Empty response message",
};

const defaultProps = {
  formattedEntityData: {
    perPlanResponses: [],
  },
  printVersion: false,
  notAnswered: mockNotAnswered,
  sx: mockSx,
  topSection: true,
  bottomSection: true,
};

describe("QualityMeasuresSection", () => {
  describe("Legacy template tests (backward compatibility)", () => {
    const legacyEntityData = {
      name: "Legacy Measure",
      domain: "Clinical Quality",
      nqfNumber: "0123",
      reportingRateType: "State-specific rate",
      set: "Adult Health",
      reportingPeriod: "January 2024 - December 2024",
      description: "This is a legacy measure description",
      perPlanResponses: [
        { name: "Plan A", response: "85%" },
        { name: "Plan B", response: "92%" },
      ],
    };

    test("renders legacy top section correctly", () => {
      render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={legacyEntityData}
          topSection={true}
          bottomSection={false}
        />
      );

      expect(screen.getByText("Legacy Measure")).toBeInTheDocument();
      expect(screen.getByText("Measure Domain")).toBeInTheDocument();
      expect(screen.getByText("Clinical Quality")).toBeInTheDocument();
      expect(
        screen.getByText("National Quality Forum (NQF) number")
      ).toBeInTheDocument();
      expect(screen.getByText("0123")).toBeInTheDocument();
    });

    test("renders legacy bottom section correctly", () => {
      render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={legacyEntityData}
          topSection={false}
          bottomSection={true}
        />
      );

      expect(screen.getByText("Measure results")).toBeInTheDocument();
      expect(screen.getByText("Plan A")).toBeInTheDocument();
      expect(screen.getByText("85%")).toBeInTheDocument();
      expect(screen.getByText("Plan B")).toBeInTheDocument();
      expect(screen.getByText("92%")).toBeInTheDocument();
    });
  });

  describe("New template tests", () => {
    const newEntityData = {
      name: "New Measure",
      cmitNumber: "CMIT123",
      description: "This is a new measure description",
      identifierUrl: "https://example.com/measure-spec",
      identifierDomain: "Care Coordination",
      dataVersion: "v2024.1",
      activities: "Quality improvement, Performance monitoring",
      measureResults: [
        {
          planName: "Plan X",
          notReporting: false,
          dataCollectionMethod: "Electronic health records",
          rateResults: [
            { rate: "Numerator", rateResult: "450" },
            { rate: "Denominator", rateResult: "500" },
            { rate: "Rate", rateResult: "90%" },
          ],
        },
      ],
    };

    test("renders new top section with CMIT number", () => {
      render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={newEntityData}
          topSection={true}
          bottomSection={false}
        />
      );

      expect(screen.getByText("New Measure")).toBeInTheDocument();
      expect(
        screen.getByText("Measure identification number or definition")
      ).toBeInTheDocument();
      expect(screen.getByText("CMIT: CMIT123")).toBeInTheDocument();
    });

    test("renders new bottom section with reporting plan", () => {
      render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={newEntityData}
          topSection={false}
          bottomSection={true}
        />
      );

      expect(screen.getByText("D2.VII.7 Measure results")).toBeInTheDocument();
      expect(screen.getByText("Plan X")).toBeInTheDocument();
      expect(screen.getByText("Electronic health records")).toBeInTheDocument();
    });
  });

  describe("Template detection logic", () => {
    test("detects legacy template when perPlanResponses is present", () => {
      const legacyData = {
        name: "Test",
        domain: "Test Domain",
        perPlanResponses: [{ name: "Plan A", response: "Yes" }],
      };

      render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={legacyData}
          bottomSection={true}
          topSection={false}
        />
      );

      // Legacy template shows "Measure results" (without the D2.VII.7 prefix)
      expect(screen.getByText("Measure results")).toBeInTheDocument();
    };);

    test("detects new template when measureResults is present", () => {
      const newData = {
        name: "Test",
        measureResults: [
          {
            planName: "Plan X",
            notReporting: false,
            dataCollectionMethod: "Survey",
            rateResults: [],
          },
        ],
      };

      render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={newData}
          bottomSection={true}
          topSection={false}
        />
      );

      // New template shows "D2.VII.7 Measure results"
      expect(screen.getByText("D2.VII.7 Measure results")).toBeInTheDocument();
    });

    test("prioritizes perPlanResponses for legacy detection even with other fields present", () => {
      const legacyData = {
        name: "Test",
        nqfNumber: "0123",
        domain: "Clinical",
        perPlanResponses: [{ name: "Plan A", response: "Yes" }],
        // cmitNumber could theoretically exist but perPlanResponses takes priority
      };

      render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={legacyData}
          bottomSection={true}
          topSection={false}
        />
      );

      // Legacy template identifier
      expect(screen.getByText("Measure results")).toBeInTheDocument();
    });

    test("defaults to new template when neither storage field is present", () => {
      const ambiguousData = {
        name: "Test",
        cmitNumber: "CMIT123",
        // Neither perPlanResponses nor measureResults present
      };

      render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={ambiguousData}
          topSection={true}
          bottomSection={false}
        />
      );

      // New template identifier
      expect(
        screen.getByText("Measure identification number or definition")
      ).toBeInTheDocument();
    };);
  });

  describe("Original test cases", () => {
    test("renders heading as <p> when isPDF is true", () => {
      const { container } = render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={{
            name: "PDF Heading",
            perPlanResponses: [], // Legacy template field
          }}
          isPDF={true}
        />
      );

      const heading = container.querySelector("p");
      expect(heading).toHaveTextContent("PDF Heading");
    });

    test("renders heading as <h4> when isPDF is false", () => {
      const { container } = render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={{ name: "H4 Heading" }}
          isPDF={false}
        />
      );

      const heading = container.querySelector("h4");
      expect(heading).toHaveTextContent("H4 Heading");
    });

    test("renders custom missing response message when provided", () => {
      render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={{
            isPartiallyComplete: true,
            perPlanResponses: [], // Legacy template field
          }}
          verbiage={{ entityMissingResponseMessage: "Custom missing message" }}
        />
      );

      expect(screen.getByText("Custom missing message")).toBeInTheDocument();
    });

    test("renders plan responses correctly with empty responses marked with error class", () => {
      const data = {
        perPlanResponses: [
          { name: "Plan A", response: "Response A" },
          { name: "Plan B", response: "" },
          { name: "Plan C", response: "Response C" },
        ],
      };

      render(
        <QualityMeasuresSection {...defaultProps} formattedEntityData={data} />
      );

      expect(screen.getByText("Plan A")).toBeInTheDocument();
      expect(screen.getByText("Plan B")).toBeInTheDocument();
      expect(screen.getByText("Plan C")).toBeInTheDocument();
      expect(screen.getByText("Response A")).toBeInTheDocument();
      expect(screen.getByText("Response C")).toBeInTheDocument();

      const errorContainers = document.querySelectorAll(".error");
      expect(errorContainers.length).toBe(1);
    });

    test("renders entityEmptyResponseMessage when response is empty and printVersion is false", () => {
      const data = {
        perPlanResponses: [{ name: "Plan A", response: "" }],
      };

      render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={data}
          verbiage={{ entityEmptyResponseMessage: "No response provided" }}
        />
      );

      expect(screen.getByText("No response provided")).toBeInTheDocument();
    });

    test("shows notAnswered placeholder when printVersion is true and response is missing", () => {
      const data = {
        perPlanResponses: [
          { name: "Plan A", response: "" },
          { name: "Plan B", response: "Some response" },
        ],
        ...mockQualityMeasuresData,
      };

      render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={data}
          printVersion={true}
          notAnswered={mockNotAnswered}
        />
      );

      expect(screen.getByText("Not answered")).toBeInTheDocument();
      expect(screen.getByText("Some response")).toBeInTheDocument();
    });

    test("renders nothing when missing response message and printVersion is false", () => {
      const data = {
        perPlanResponses: [
          { name: "Plan A", response: "" },
          { name: "Plan B", response: "Some response" },
        ],
        ...mockQualityMeasuresData,
      };
      render(
        <QualityMeasuresSection {...defaultProps} formattedEntityData={data} />
      );

      expect(screen.queryByText("Not answered")).not.toBeInTheDocument();
    });

    test("renders notAnswered fallback when partially complete and no custom message", () => {
      render(
        <QualityMeasuresSection
          {...defaultProps}
          formattedEntityData={{
            isPartiallyComplete: true,
            perPlanResponses: [],
            ...mockQualityMeasuresData,
          }}
          printVersion={true}
          verbiage={{}}
        />
      );

      expect(screen.getByText("Not answered")).toBeInTheDocument();
    });
  });

  testA11yAct(<QualityMeasuresSection {...defaultProps} />);
});
