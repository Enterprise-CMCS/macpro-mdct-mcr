import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { HomePage } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// verbiage
import verbiage from "verbiage/pages/home";

const homeView = (
  <RouterWrappedComponent>
    <HomePage />
  </RouterWrappedComponent>
);

describe("Test HomePage", () => {
  beforeEach(() => {
    render(homeView);
  });

  test("Check that HomePage renders", () => {
    expect(screen.getByText(verbiage.cards.MCPAR.title)).toBeVisible();
  });
});

describe("Test HomePage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(homeView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
