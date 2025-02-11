import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
// components
import { SpreadsheetWidget } from "components";
import { testA11y } from "utils/testing/commonTests";

const SpreadsheetWidgetComponent = (
  <SpreadsheetWidget description="mock-description" alt={"mock-alt-text"} />
);

describe("<SpreadsheetWidget />", () => {
  test("Component is visible", () => {
    render(SpreadsheetWidgetComponent);
    expect(screen.getByText("mock-description")).toBeVisible();
  });

  testA11y(SpreadsheetWidgetComponent);
});
