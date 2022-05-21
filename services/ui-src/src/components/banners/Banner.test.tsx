import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { BannerTypes } from "utils/types/types";
//components
import { Banner } from "components";

const bannerComponent = (
  <RouterWrappedComponent>
    <Banner
      status={BannerTypes.INFO}
      title="Test banner!"
      description="This is for testing."
    />
  </RouterWrappedComponent>
);

describe("Test Banner Item", () => {
  beforeEach(() => {
    render(bannerComponent);
  });

  test("Banner is visible", () => {
    expect(screen.getByTestId("banner")).toBeVisible();
  });
});

describe("Test Info Banner accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(bannerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
