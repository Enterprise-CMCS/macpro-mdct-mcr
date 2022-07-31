import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ImageWidget } from "components";
import NavigationSectionsImage from "../../../assets/images/NavigationSections_2x.png";

const fullContent = {
  src: NavigationSectionsImage,
  alt: "Image of side navigation in the application",
  additionalInfo: "Preview of the online MCPAR form navigation.",
};

const imageWidgetComponent = (
  <ImageWidget content={fullContent} data-testid="image-widget" />
);

describe("Test ImageWidget with all props", () => {
  beforeEach(() => {
    render(imageWidgetComponent);
  });

  test("Component is visible", () => {
    expect(screen.getByTestId("image-widget")).toBeVisible();
  });

  test("Image is visible", () => {
    const imageAltText = fullContent.alt;
    expect(screen.getByAltText(imageAltText)).toBeVisible();
  });

  test("Additional Info is visible when passed", () => {
    expect(screen.getByText(fullContent.additionalInfo)).toBeVisible();
  });
});

describe("Test ImageWidget accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(imageWidgetComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
