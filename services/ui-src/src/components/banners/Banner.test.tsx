import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { Banner } from "components";
import { BannerTypes } from "utils/types/types";

const infoAlert = (
  <RouterWrappedComponent>
    <Banner
      status={BannerTypes.INFO}
      bgColor="palette.alt_lightest"
      accentColor="palette.alt"
      title="Test banner!"
      description="This is for testing."
    />
  </RouterWrappedComponent>
);

describe("Test Banner Item", () => {
  beforeEach(() => {
    render(infoAlert);
  });

  test("Banner is visible", () => {
    expect(screen.getByTestId("banner")).toBeVisible();
  });
});

describe("Test Info Banner accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(infoAlert);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
