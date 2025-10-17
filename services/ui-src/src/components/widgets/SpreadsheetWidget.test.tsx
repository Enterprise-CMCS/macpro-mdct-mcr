import { render, screen } from "@testing-library/react";
// components
import { SpreadsheetWidget } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const SpreadsheetWidgetComponent = (
  <SpreadsheetWidget description="mock-description" alt={"mock-alt-text"} />
);

describe("<SpreadsheetWidget />", () => {
  test("Component is visible", () => {
    render(SpreadsheetWidgetComponent);
    expect(screen.getByText("mock-description")).toBeVisible();
  });

  testA11yAct(SpreadsheetWidgetComponent);
});
