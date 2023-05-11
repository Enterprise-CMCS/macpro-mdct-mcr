import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { PageTemplate } from "components";

const standardPageComponent = (
  <PageTemplate>
    <p>Test text</p>
  </PageTemplate>
);

const reportPageComponent = (
  <PageTemplate type="report">
    <p>Test text</p>
  </PageTemplate>
);

describe("Test PageTemplate view", () => {
  test("Check that PageTemplate (standard) renders", () => {
    render(standardPageComponent);
    expect(screen.getByText("Test text")).toBeVisible();
  });

  test("Check that PageTemplate (report) renders", () => {
    render(reportPageComponent);
    expect(screen.getByText("Test text")).toBeVisible();
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
