import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { InfoBanner } from "components";

const infoAlert = (
  <RouterWrappedComponent>
    <InfoBanner />
  </RouterWrappedComponent>
);

describe("Test Info Banner Item", () => {
  beforeEach(() => {
    render(infoAlert);
  });

  test("Info Banner is visible", () => {
    expect(screen.getByTestId("info-alert")).toBeVisible();
  });
});

describe("Test Info Banner accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(infoAlert);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
