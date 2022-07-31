import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { IconWidget } from "components";
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

const iconWidgetComponent = (
  <IconWidget content={fullContent} data-testid="icon-widget" />
);

describe("Test IconWidget with all props", () => {
  beforeEach(() => {
    render(iconWidgetComponent);
  });

  test("Component is visible", () => {
    expect(screen.getByTestId("icon-widget")).toBeVisible();
  });
});

describe("Test IconWidget accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(iconWidgetComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
