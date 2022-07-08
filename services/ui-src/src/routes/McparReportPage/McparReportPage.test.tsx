import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { McparReportPage } from "routes";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import sectionA_pointofcontact from "verbiage/forms/apoc.json";

const mcparComponent = (
  <RouterWrappedComponent>
    <McparReportPage pageJson={sectionA_pointofcontact} />
  </RouterWrappedComponent>
);

describe("Test McparReportPage view", () => {
  beforeEach(() => {
    render(mcparComponent);
  });

  test("Check that McparReportPage view renders", () => {
    expect(screen.getByTestId("apointofcontact")).toBeVisible();
  });
});

describe("Test McparReportPage view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(mcparComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
