import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { IconlessWidget } from "components";

const fullContent = {
  leftBarColor: "#0071BC",
  title: "Examples of managed care programs:",
  descriptionList: [
    "Health and Recovery Plans (Comprehensive MCO)",
    "Dental Managed Care",
  ],
};

const iconlessWidgetComponent = (
  <IconlessWidget content={fullContent} data-testid="iconless-widget" />
);

describe("Test IconlessWidget with all props", () => {
  beforeEach(() => {
    render(iconlessWidgetComponent);
  });

  test("Component is visible", () => {
    expect(screen.getByTestId("iconless-widget")).toBeVisible();
  });
});

describe("Test IconlessWidget accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(iconlessWidgetComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
