import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { PageTemplate } from "components";

const standardPageComponent = (
  <PageTemplate data-testid="page-template">
    <p>Test text</p>
  </PageTemplate>
);

const reportPageComponent = (
  <PageTemplate type="report" data-testid="page-template">
    <p>Test text</p>
  </PageTemplate>
);

describe("Test PageTemplate view", () => {
  test("Check that PageTemplate (standard) renders", () => {
    const { getByTestId } = render(standardPageComponent);
    expect(getByTestId("page-template")).toBeVisible();
  });

  test("Check that PageTemplate (report) renders", () => {
    const { getByTestId } = render(reportPageComponent);
    expect(getByTestId("page-template")).toBeVisible();
  });
});

describe("Test PageTemplate accessibility", () => {
  test("PageTemplate (standard) hould not have basic accessibility issues", async () => {
    const { container } = render(standardPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("PageTemplate (report) hould not have basic accessibility issues", async () => {
    const { container } = render(reportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
