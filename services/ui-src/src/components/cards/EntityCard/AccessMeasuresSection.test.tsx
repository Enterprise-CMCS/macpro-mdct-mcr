import React from "react";
import { render, screen } from "@testing-library/react";
import { AccessMeasuresSection } from "./AccessMeasuresSection";
import {
  mockfullAccessMeasuresData,
  mockNotAnswered,
} from "utils/testing/mockEntities";
import { testA11y } from "utils/testing/commonTests";

const baseProps = {
  sx: {},
  notAnswered: mockNotAnswered,
  providerText: jest.fn(() => "Provider: Details"),
};

const accessMeasuresSectionComponent = (
  <AccessMeasuresSection
    formattedEntityData={mockfullAccessMeasuresData}
    sx={{}}
    topSection
    bottomSection
    notAnswered={mockNotAnswered}
  />
);

describe("AccessMeasuresSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders heading as <p> when isPDF is true", () => {
    const { container } = render(
      <AccessMeasuresSection
        formattedEntityData={{ standardType: "PDF Heading" }}
        sx={{}}
        topSection
        isPDF={true}
        notAnswered={mockNotAnswered}
      />
    );

    const heading = container.querySelector("p.chakra-heading");
    expect(heading).toHaveTextContent("PDF Heading");
  });

  test("renders heading as <h4> when isPDF is false", () => {
    const { container } = render(
      <AccessMeasuresSection
        formattedEntityData={{ standardType: "H4 Heading" }}
        sx={{}}
        topSection
        isPDF={false}
        notAnswered={mockNotAnswered}
      />
    );

    const heading = container.querySelector("h4");
    expect(heading).toHaveTextContent("H4 Heading");
  });

  test("renders top section correctly", () => {
    render(
      <AccessMeasuresSection
        formattedEntityData={mockfullAccessMeasuresData}
        sx={{}}
        topSection
        printVersion={false}
      />
    );

    expect(screen.getByRole("heading", { name: "Type A", level: 4 }));
    expect(
      screen.getByText("This is a description of the standard.")
    ).toBeVisible();
    expect(screen.getByText("General category")).toBeVisible();
    expect(screen.getByText("General")).toBeVisible();
  });

  test("renders bottom section with correct data", () => {
    render(
      <AccessMeasuresSection
        formattedEntityData={mockfullAccessMeasuresData}
        sx={{}}
        bottomSection
        printVersion={false}
        notAnswered={mockNotAnswered}
      />
    );

    const expectedTexts = [
      "Provider",
      "Region",
      "Population",
      "Monitoring Methods",
      "Frequency of oversight methods",
      "Hospital: Some details",
      "North",
      "Urban",
      "Method A, Method B",
      "Monthly",
    ];

    expectedTexts.forEach((text) => {
      expect(screen.getByText(text)).toBeVisible();
    });
  });

  test("renders both top and bottom sections", () => {
    render(
      <AccessMeasuresSection
        formattedEntityData={mockfullAccessMeasuresData}
        sx={{}}
        topSection
        bottomSection
        printVersion
        notAnswered={mockNotAnswered}
      />
    );

    // Top section field
    expect(screen.getByText("C2.V.3 Standard type: Type A")).toBeVisible();
    // Bottom section field
    expect(screen.getByText("C2.V.4 Provider")).toBeVisible();
  });

  test("prefixes labels with version numbers when printVersion is true", () => {
    render(
      <AccessMeasuresSection
        {...baseProps}
        printVersion
        bottomSection
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
      expect(screen.getByText(label)).toBeVisible();
    });
  });

  test("renders notAnswered fallback when data is missing", () => {
    render(
      <AccessMeasuresSection
        formattedEntityData={{
          provider: undefined,
          providerDetails: undefined,
          region: undefined,
          population: "",
          monitoringMethods: undefined,
          methodFrequency: undefined,
        }}
        sx={{}}
        bottomSection
        printVersion={true}
        notAnswered={mockNotAnswered}
      />
    );

    const fallbacks = screen.getAllByTestId("not-answered");
    expect(fallbacks.length).toBeGreaterThanOrEqual(4);
  });

  test("applies 'error' class when key fields are missing", () => {
    const { container } = render(
      <AccessMeasuresSection
        formattedEntityData={{
          provider: "",
          region: undefined,
          population: "",
          monitoringMethods: [],
          methodFrequency: "",
        }}
        sx={{}}
        bottomSection
        printVersion
        notAnswered={mockNotAnswered}
      />
    );

    const errorBox = container.querySelector(".error");
    expect(errorBox).toBeVisible();
  });

  test("does not apply 'error' class when all key fields are present", () => {
    const { container } = render(
      <AccessMeasuresSection
        formattedEntityData={mockfullAccessMeasuresData}
        sx={{}}
        bottomSection
        printVersion={false}
        notAnswered={mockNotAnswered}
      />
    );

    const errorContainer = container.querySelector(".error");
    expect(errorContainer).not.toBeInTheDocument();
  });

  testA11y(accessMeasuresSectionComponent);
});
