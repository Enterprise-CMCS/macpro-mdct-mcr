import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { WidgetContainer } from "./WidgetContainer";
// assets
import NavigationSectionsImage from "../../../assets/images/NavigationSections_2x.png";
import greenSpreadsheetIcon from "../../../assets/icons/icon_spreadsheet_green.png";

const widgets = [
  {
    type: "imageWidget",
    content: {
      src: NavigationSectionsImage,
      alt: "Image of side navigation in the application ",
      additionalInfo: "Preview of the online MCPAR form navigation.",
    },
  },
  {
    type: "iconWidget",
    content: {
      leftBarColor: "#2E8540",
      icon: greenSpreadsheetIcon,
      iconDescription: "Excel Workbook Icon",
      title: "Find in the Excel Workbook",
      descriptionList: ["A_Program_Info"],
      additionalInfo:
        "Use these guides to understand which sections match specific tabs in the Excel workbook.",
    },
  },
  {
    type: "iconlessWidget",
    content: {
      leftBarColor: "#0071BC",
      title: "Examples of managed care programs:",
      descriptionList: [
        "Health and Recovery Plans (Comprehensive MCO)",
        "Dental Managed Care",
      ],
    },
  },
];

const widgetContainer = (
  <WidgetContainer widgets={widgets} data-testid="widget-container" />
);

describe("Test WidgetContainer with all props", () => {
  test("Component is visible with all children present", () => {
    render(widgetContainer);
    expect(screen.getByTestId("widget-container")).toBeVisible();
    expect(screen.getByTestId("widget-container").children.length).toBe(3);
  });
});

describe("Test WidgetContainer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(widgetContainer);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
