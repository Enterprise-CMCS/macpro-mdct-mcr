import React from "react";
import { render, screen } from "@testing-library/react";
import { StandardsSection } from "./StandardsSection";
import { mockFormattedEntityData } from "utils/testing/mockEntities";
import { testA11yAct } from "utils/testing/commonTests";

const standardsSectionComponent = (
  <StandardsSection
    formattedEntityData={mockFormattedEntityData}
    sx={{}}
    topSection
    bottomSection
  />
);
describe("StandardsSection", () => {
  test("renders the top section when topSection is true", () => {
    render(
      <StandardsSection
        formattedEntityData={mockFormattedEntityData}
        sx={{}}
        topSection
        bottomSection={false}
      />
    );

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Clinical Standards")).toBeInTheDocument();
    expect(
      screen.getByText(
        "A description of clinical standards used in the evaluation."
      )
    ).toBeInTheDocument();
  });

  test("renders the bottom section when bottomSection is true", () => {
    render(
      <StandardsSection
        formattedEntityData={mockFormattedEntityData}
        sx={{}}
        topSection={false}
        bottomSection
      />
    );

    const expectedFields = [
      ["Provider type(s)", "Clinic, Hospital"],
      ["Analysis method(s)", "Quantitative, Qualitative"],
      ["Region", "North America"],
      ["Population", "Adults"],
    ];

    expectedFields.forEach(([label, value]) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  test("renders both top and bottom sections when both flags are true", () => {
    render(
      <StandardsSection
        formattedEntityData={mockFormattedEntityData}
        sx={{}}
        topSection
        bottomSection
      />
    );

    const topSectionFields = [
      "42",
      "Clinical Standards",
      "A description of clinical standards used in the evaluation.",
    ];

    topSectionFields.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    const bottomSectionFields: [string, string][] = [
      ["Provider type(s)", "Clinic, Hospital"],
      ["Analysis method(s)", "Quantitative, Qualitative"],
      ["Region", "North America"],
      ["Population", "Adults"],
    ];

    bottomSectionFields.forEach(([label, value]) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  test("renders nothing when both topSection and bottomSection are false", () => {
    const { container } = render(
      <StandardsSection
        formattedEntityData={mockFormattedEntityData}
        sx={{}}
        topSection={false}
        bottomSection={false}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("handles missing optional fields gracefully", () => {
    render(
      <StandardsSection
        formattedEntityData={{ provider: "Hospital" }}
        sx={{}}
        bottomSection
      />
    );

    expect(screen.getByText("Provider type(s)")).toBeInTheDocument();
    expect(screen.getByText("Hospital")).toBeInTheDocument();
    // Missing fields shouldn't throw errors, and should not render values
    expect(screen.queryByText("Quantitative")).not.toBeInTheDocument();
    expect(screen.queryByText("North")).not.toBeInTheDocument();
    expect(screen.queryByText("Urban")).not.toBeInTheDocument();
  });

  testA11yAct(standardsSectionComponent);
});
