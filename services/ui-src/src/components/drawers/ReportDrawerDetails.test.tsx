import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ReportDrawerDetails } from "components";

const mockAccessMeasureDrawerDetails = {
  standardDescription: "mock description",
  category: "mock category",
};

const ReportDrawerDetailsAccessMeasuresComponent = (
  <ReportDrawerDetails
    drawerDetails={mockAccessMeasureDrawerDetails}
    entityType="accessMeasures"
  />
);

const ReportDrawerDetailsSanctionsComponent = (
  <ReportDrawerDetails
    drawerDetails={{ field: "todo" }}
    entityType="sanctions"
  />
);

const ReportDrawerDetailsQualityMeasuresComponent = (
  <ReportDrawerDetails
    drawerDetails={{ field: "todo" }}
    entityType="qualityMeasures"
  />
);

describe("Test ReportDrawerDetails renders given text", () => {
  it("Should render access measures text provided in drawerDetails", async () => {
    render(ReportDrawerDetailsAccessMeasuresComponent);
    expect(
      screen.getByText(
        "Standard Type - " + mockAccessMeasureDrawerDetails.category
      )
    ).toBeVisible();
    expect(
      screen.getByText(mockAccessMeasureDrawerDetails.standardDescription)
    ).toBeVisible();
  });
});

describe("Test ReportDrawer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(ReportDrawerDetailsAccessMeasuresComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues", async () => {
    const { container } = render(ReportDrawerDetailsSanctionsComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues", async () => {
    const { container } = render(ReportDrawerDetailsQualityMeasuresComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
