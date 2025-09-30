import React from "react";
import { render, screen } from "@testing-library/react";
import { StandardsSection } from "./StandardsSection";
import { mockStandardsFullData } from "utils/testing/mockEntities";

describe("StandardsSection", () => {
  test("renders all labels", () => {
    render(
      <StandardsSection formattedEntityData={mockStandardsFullData} sx={{}} />
    );

    const labels = [
      "Provider type(s)",
      "Analysis method(s)",
      "Region",
      "Population",
    ];

    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test("renders all values from formattedEntityData", () => {
    render(
      <StandardsSection formattedEntityData={mockStandardsFullData} sx={{}} />
    );

    expect(screen.getByText("Hospital")).toBeInTheDocument();
    expect(screen.getByText("Quantitative")).toBeInTheDocument();
    expect(screen.getByText("North")).toBeInTheDocument();
    expect(screen.getByText("Urban")).toBeInTheDocument();
  });

  test("handles missing optional fields gracefully", () => {
    render(
      <StandardsSection
        formattedEntityData={{ provider: "Physician" }}
        sx={{}}
      />
    );

    expect(screen.getByText("Provider type(s)")).toBeInTheDocument();
    expect(screen.getByText("Physician")).toBeInTheDocument();
    // Missing fields shouldn't throw errors, and should not render values
    expect(screen.queryByText("Quantitative")).not.toBeInTheDocument();
    expect(screen.queryByText("North")).not.toBeInTheDocument();
    expect(screen.queryByText("Urban")).not.toBeInTheDocument();
  });
});
