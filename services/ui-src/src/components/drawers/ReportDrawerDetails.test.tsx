import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ReportDrawerDetails } from "components";

const mockAccessMeasuresDrawerDetails = {
  standardDescription: "mock description",
  category: "mock category",
};

const ReportDrawerDetailsAccessMeasuresComponent = (
  <ReportDrawerDetails
    drawerDetails={mockAccessMeasuresDrawerDetails}
    entityType="accessMeasures"
  />
);

const mockSanctionsDrawerDetails = {
  interventionType: "mock intervention type",
  interventionTopic: "mock intervention topic",
  planName: "mock plan name",
  interventionReason: "mock intervention reason",
};

const ReportDrawerDetailsSanctionsComponent = (
  <ReportDrawerDetails
    drawerDetails={mockSanctionsDrawerDetails}
    entityType="sanctions"
  />
);

const mockQualityMeasuresDrawerDetails = {
  domain: "mock domain",
  name: "mock quality measure name",
  nqfNumber: "mock nqf number",
  reportingRateType: "mock reporting rate type",
  set: "mock measure set",
  reportingPeriod: "mock reporting period",
  description: "mock description",
};

const ReportDrawerDetailsQualityMeasuresComponent = (
  <ReportDrawerDetails
    drawerDetails={mockQualityMeasuresDrawerDetails}
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
      screen.getByText(mockAccessMeasuresDrawerDetails.category)
    ).toBeVisible();
  });

  it("Should render sanctions text provided in drawerDetails", async () => {
    render(ReportDrawerDetailsSanctionsComponent);
    expect(
      screen.getByText(mockSanctionsDrawerDetails.interventionTopic)
    ).toBeVisible();
  });

  it("Should render quality measures text provided in drawerDetails", async () => {
    render(ReportDrawerDetailsQualityMeasuresComponent);
    expect(
      screen.getByText(mockQualityMeasuresDrawerDetails.domain)
    ).toBeVisible();
    expect(
      screen.getByText(mockQualityMeasuresDrawerDetails.name)
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
