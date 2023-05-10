import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ReportDrawerDetails } from "components";
import {
  mockUnfinishedAccessMeasuresFormattedEntityData,
  mockUnfinishedQualityMeasuresFormattedEntityData,
  mockUnfinishedSanctionsFormattedEntityData,
} from "utils/testing/setupJest";

const ReportDrawerDetailsAccessMeasuresComponent = (
  <ReportDrawerDetails
    drawerDetails={mockUnfinishedAccessMeasuresFormattedEntityData}
    entityType="accessMeasures"
  />
);

const ReportDrawerDetailsSanctionsComponent = (
  <ReportDrawerDetails
    drawerDetails={mockUnfinishedSanctionsFormattedEntityData}
    entityType="sanctions"
  />
);

const ReportDrawerDetailsQualityMeasuresComponent = (
  <ReportDrawerDetails
    drawerDetails={mockUnfinishedQualityMeasuresFormattedEntityData}
    entityType="qualityMeasures"
  />
);

const ReportDrawerDetailsInvalidEntityTypeComponent = (
  <ReportDrawerDetails drawerDetails={{}} entityType="bssEntities" />
);

describe("Test ReportDrawerDetails renders given text", () => {
  it("Should render access measures text provided in drawerDetails", async () => {
    render(ReportDrawerDetailsAccessMeasuresComponent);
    expect(
      screen.getByText(mockUnfinishedAccessMeasuresFormattedEntityData.category)
    ).toBeVisible();
  });

  it("Should render sanctions text provided in drawerDetails", async () => {
    render(ReportDrawerDetailsSanctionsComponent);
    expect(
      screen.getByText(
        mockUnfinishedSanctionsFormattedEntityData.interventionTopic
      )
    ).toBeVisible();
  });

  it("Should render quality measures text provided in drawerDetails", async () => {
    render(ReportDrawerDetailsQualityMeasuresComponent);
    expect(
      screen.getByText(mockUnfinishedQualityMeasuresFormattedEntityData.domain)
    ).toBeVisible();
    expect(
      screen.getByText(mockUnfinishedQualityMeasuresFormattedEntityData.name)
    ).toBeVisible();
  });
});

describe("Test ReportDrawerDetails invalid entity type", () => {
  it("Renders invalid entity type as 'entity type'", () => {
    render(ReportDrawerDetailsInvalidEntityTypeComponent);
    expect(screen.getByText("bssEntities")).toBeVisible();
  });
});

describe("Test ReportDrawerDetails accessibility", () => {
  it("AccessMeasures drawer details should not have basic accessibility issues", async () => {
    const { container } = render(ReportDrawerDetailsAccessMeasuresComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Sanctions drawer details should not have basic accessibility issues", async () => {
    const { container } = render(ReportDrawerDetailsSanctionsComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("QualityMeasures drawer details should not have basic accessibility issues", async () => {
    const { container } = render(ReportDrawerDetailsQualityMeasuresComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Invalid entity drawer details should not have basic accessibility issues", async () => {
    const { container } = render(ReportDrawerDetailsInvalidEntityTypeComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
