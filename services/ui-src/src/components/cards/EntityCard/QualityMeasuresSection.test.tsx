import React from "react";
import { render, screen } from "@testing-library/react";
import { QualityMeasuresSection } from "./QualityMeasuresSection";
import {
  mockNotAnswered,
  mockQualityMeasuresData,
} from "utils/testing/mockEntities";
import { testA11y } from "utils/testing/commonTests";

const defaultProps = {
  formattedEntityData: {
    perPlanResponses: [],
  },
  printVersion: false,
  notAnswered: mockNotAnswered,
  sx: {},
  topSection: true,
  bottomSection: true,
};

describe("QualityMeasuresSection", () => {
  test("renders heading as <p> when isPDF is true", () => {
    const { container } = render(
      <QualityMeasuresSection
        {...defaultProps}
        formattedEntityData={{ name: "PDF Heading" }}
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
        formattedEntityData={{ isPartiallyComplete: true }}
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

    const emptyResponses = screen.getAllByText("", { exact: true });
    expect(emptyResponses.length).toBeGreaterThanOrEqual(1);

    // 'error' class is on plan with empty response
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

  testA11y(<QualityMeasuresSection {...defaultProps} />);
});
