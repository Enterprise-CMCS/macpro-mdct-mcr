import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
// components
import { HomePage } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";
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

  testA11y(homeView);
});
