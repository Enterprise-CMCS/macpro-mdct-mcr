import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { SpreadsheetWidget } from "components";
import greenSpreadsheetIcon from "../../../assets/icons/icon_spreadsheet_green.png";

const fullContent = {
  leftBarColor: "#2E8540",
  icon: greenSpreadsheetIcon,
  iconDescription: "Excel Workbook Icon",
  title: "Find in the Excel Workbook",
  descriptionList: ["A_Program_Info"],
  additionalInfo:
    "Use these guides to understand which sections match specific tabs in the Excel workbook.",
};

const SpreadsheetWidgetComponent = (
  <SpreadsheetWidget content={fullContent} data-testid="spreadsheet-widget" />
);

describe("Test SpreadsheetWidget with all props", () => {
  beforeEach(() => {
    render(SpreadsheetWidgetComponent);
  });

  test("Component is visible", () => {
    expect(screen.getByTestId("spreadsheet-widget")).toBeVisible();
  });
});

describe("Test SpreadsheetWidget accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(SpreadsheetWidgetComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
