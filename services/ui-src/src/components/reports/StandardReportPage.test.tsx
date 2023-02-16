import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, StandardReportPage } from "components";
// utils
import {
  mockForm,
  mockReportContext,
  mockStandardReportPageJson,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const standardPageSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StandardReportPage
        route={{ ...mockStandardReportPageJson, form: mockForm }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test StandardReportPage", () => {
  test("StandardReportPage view renders", () => {
    render(standardPageSectionComponent);
    expect(screen.getByTestId("standard-page")).toBeVisible();
  });
});

describe("Test StandardReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(standardPageSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
