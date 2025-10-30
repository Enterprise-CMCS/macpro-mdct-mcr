import { render, screen } from "@testing-library/react";
// components
import { HomePage } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/home";

const homeView = (
  <RouterWrappedComponent>
    <HomePage />
  </RouterWrappedComponent>
);

describe("<HomePage />", () => {
  test("Check that HomePage renders", () => {
    render(homeView);
    expect(screen.getByText(verbiage.cards.MCPAR.title)).toBeVisible();
  });

  testA11yAct(homeView);
});
