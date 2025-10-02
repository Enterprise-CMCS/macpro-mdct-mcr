import React from "react";
import { render, screen } from "@testing-library/react";
import { SanctionsSection } from "./SanctionsSection";
import {
  mockNotAnswered,
  mockSanctionsFullData,
  mockSanctionsPartialData,
} from "utils/testing/mockEntities";
import { testA11y } from "utils/testing/commonTests";

const SanctionsSectionComponentFullData = (
  <SanctionsSection
    formattedEntityData={mockSanctionsFullData}
    printVersion={false}
    notAnswered={mockNotAnswered}
    sx={{}}
  />
);

describe("SanctionsSection", () => {
  test("renders all labels without version numbers when printVersion is false", () => {
    render(SanctionsSectionComponentFullData);

    const labels = [
      "Sanction details",
      "Instances of non-compliance",
      "Sanction amount",
      "Date assessed",
      "Remediation date non-compliance was corrected",
      "Corrective action plan",
    ];

    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("$5,000")).toBeInTheDocument();
    expect(screen.getByText("2025-05-01")).toBeInTheDocument();
    expect(screen.getByText("Yes 2025-06-01")).toBeInTheDocument();
    expect(screen.getByText("Plan A")).toBeInTheDocument();
  });

  test("prefixes labels when printVersion is true", () => {
    render(
      <SanctionsSection
        formattedEntityData={mockSanctionsFullData}
        printVersion={true}
        notAnswered={mockNotAnswered}
        sx={{}}
      />
    );

    const versionedLabels = [
      "D3.VIII.5 Instances of non-compliance",
      "D3.VIII.6 Sanction amount",
      "D3.VIII.7 Date assessed",
      "D3.VIII.8 Remediation date non-compliance was corrected",
      "D3.VIII.9 Corrective action plan",
    ];

    versionedLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test("shows 'notAnswered' for missing fields when printVersion is true", () => {
    render(
      <SanctionsSection
        formattedEntityData={mockSanctionsPartialData}
        printVersion={true}
        notAnswered={mockNotAnswered}
        sx={{}}
      />
    );

    const notAnsweredEls = screen.getAllByTestId("not-answered");
    expect(notAnsweredEls.length).toBeGreaterThan(0);
  });

  test("adds 'error' class when required fields are missing", () => {
    const { container } = render(
      <SanctionsSection
        formattedEntityData={mockSanctionsPartialData}
        printVersion={false}
        notAnswered={mockNotAnswered}
        sx={{}}
      />
    );

    const errorBox = container.querySelector(".error");
    expect(errorBox).toBeInTheDocument();
  });

  test("does NOT add 'error' class when all required fields are present", () => {
    const { container } = render(SanctionsSectionComponentFullData);

    const errorBox = container.querySelector(".error");
    expect(errorBox).not.toBeInTheDocument();
  });

  testA11y(SanctionsSectionComponentFullData);
});
