import React from "react";
import { render, screen } from "@testing-library/react";
import { QualityMeasuresSection } from "./QualityMeasuresSection";
import { mockNotAnswered } from "utils/testing/mockEntities";
import { testA11y } from "utils/testing/commonTests";

const qualityMeasuresSectionComponent = (
  <QualityMeasuresSection
    formattedEntityData={{ perPlanResponses: [] }}
    printVersion={false}
    notAnswered={mockNotAnswered}
    sx={{}}
  />
);

describe("QualityMeasuresSection", () => {
  test("renders the header", () => {
    render(qualityMeasuresSectionComponent);

    expect(screen.getByText("Measure results")).toBeInTheDocument();
  });

  test("renders custom missing response message when provided", () => {
    render(
      <QualityMeasuresSection
        formattedEntityData={{ isPartiallyComplete: true }}
        printVersion={false}
        notAnswered={mockNotAnswered}
        verbiage={{ entityMissingResponseMessage: "Custom missing message" }}
        sx={{}}
      />
    );

    expect(screen.getByText("Custom missing message")).toBeInTheDocument();
  });

  test("renders plan responses correctly", () => {
    const data = {
      perPlanResponses: [
        { name: "Plan A", response: "Response A" },
        { name: "Plan B", response: "" },
        { name: "Plan C", response: "Response C" },
      ],
    };

    render(
      <QualityMeasuresSection
        formattedEntityData={data}
        printVersion={false}
        notAnswered={mockNotAnswered}
        sx={{}}
      />
    );

    expect(screen.getByText("Plan A")).toBeInTheDocument();
    expect(screen.getByText("Plan B")).toBeInTheDocument();
    expect(screen.getByText("Plan C")).toBeInTheDocument();
    expect(screen.getByText("Response A")).toBeInTheDocument();
    expect(screen.getByText("Response C")).toBeInTheDocument();

    const planBResponse = screen.getAllByText("", { exact: true })[0];
    expect(planBResponse).toBeInTheDocument();

    // 'error' class is on plan with empty response
    const errorContainers = document.querySelectorAll(".error");
    expect(errorContainers.length).toBe(1);
  });

  test("shows notAnswered placeholder when printVersion is true and response is missing", () => {
    const data = {
      perPlanResponses: [
        { name: "Plan A", response: "" },
        { name: "Plan B", response: "Some response" },
      ],
    };

    render(
      <QualityMeasuresSection
        formattedEntityData={data}
        printVersion={true}
        notAnswered={mockNotAnswered}
        sx={{}}
      />
    );

    expect(screen.getByText("Not answered")).toBeInTheDocument();
    expect(screen.getByText("Some response")).toBeInTheDocument();
  });

  test("renders entityEmptyResponseMessage when response is empty and printVersion is false", () => {
    const data = {
      perPlanResponses: [{ name: "Plan A", response: "" }],
    };

    render(
      <QualityMeasuresSection
        formattedEntityData={data}
        printVersion={false}
        notAnswered={mockNotAnswered}
        verbiage={{ entityEmptyResponseMessage: "No response provided" }}
        sx={{}}
      />
    );

    expect(screen.getByText("No response provided")).toBeInTheDocument();
  });

  testA11y(qualityMeasuresSectionComponent);
});
