import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
// components
import { PageTemplate } from "components";
import { testA11y } from "utils/testing/commonTests";

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

describe("<PageTemplate />", () => {
  test("Check that PageTemplate (standard) renders", () => {
    render(standardPageComponent);
    expect(screen.getByText("Test text")).toBeVisible();
  });

  test("Check that PageTemplate (report) renders", () => {
    render(reportPageComponent);
    expect(screen.getByText("Test text")).toBeVisible();
  });

  testA11y(standardPageComponent);
  testA11y(reportPageComponent);
});
