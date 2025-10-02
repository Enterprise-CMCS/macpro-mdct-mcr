import React from "react";
import { render, screen } from "@testing-library/react";
import { AccessMeasuresSection } from "./AccessMeasuresSection";
import { mockNotAnswered } from "utils/testing/mockEntities";
import { testA11y } from "utils/testing/commonTests";

const baseProps = {
  sx: {},
  notAnswered: mockNotAnswered,
  providerText: jest.fn(() => "Provider: Details"),
};

const accessMeasuresSectionComponent = (
  <AccessMeasuresSection
    {...baseProps}
    printVersion={false}
    formattedEntityData={{
      provider: "Hospital",
      region: "North",
      population: "Urban",
      monitoringMethods: ["Method A", "Method B"],
      methodFrequency: "Monthly",
    }}
  />
);

describe("AccessMeasuresSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all fields with correct data and printVersion off", () => {
    render(accessMeasuresSectionComponent);

    expect(baseProps.providerText).toHaveBeenCalled();

    const expectedTexts = [
      "Provider",
      "Region",
      "Population",
      "Monitoring Methods",
      "Frequency of oversight methods",
      "Provider: Details",
      "North",
      "Urban",
      "Method A, Method B",
      "Monthly",
    ];

    expectedTexts.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("prefixes labels with version numbers when printVersion is true", () => {
    render(
      <AccessMeasuresSection
        {...baseProps}
        printVersion={true}
        formattedEntityData={{
          provider: "Hospital",
          region: "North",
          population: "Urban",
          monitoringMethods: ["X"],
          methodFrequency: "Weekly",
        }}
      />
    );

    const expectedLabels = [
      "C2.V.4 Provider",
      "C2.V.5 Region",
      "C2.V.6 Population",
      "C2.V.7 Monitoring Methods",
      "C2.V.8 Frequency of oversight methods",
    ];

    expectedLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test("renders notAnswered fallback when data is missing and printVersion is true", () => {
    render(
      <AccessMeasuresSection
        {...baseProps}
        printVersion={true}
        formattedEntityData={{
          provider: undefined,
          region: "",
          population: null,
          monitoringMethods: null,
          methodFrequency: undefined,
        }}
      />
    );

    const fallbacks = screen.getAllByTestId("not-answered");
    expect(fallbacks.length).toBeGreaterThanOrEqual(4);
  });

  test("applies 'error' class when key fields are missing", () => {
    const { container } = render(
      <AccessMeasuresSection
        {...baseProps}
        printVersion={true}
        formattedEntityData={{
          provider: "",
          region: null,
          population: "",
          monitoringMethods: [],
          methodFrequency: "",
        }}
      />
    );

    const errorContainer = container.querySelector(".error");
    expect(errorContainer).toBeInTheDocument();
  });

  test("does not apply 'error' class when all key fields are present", () => {
    const { container } = render(accessMeasuresSectionComponent);

    const errorContainer = container.querySelector(".error");
    expect(errorContainer).not.toBeInTheDocument();
  });

  testA11y(accessMeasuresSectionComponent);
});
