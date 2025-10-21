import { render, screen } from "@testing-library/react";
// components
import { SkipNav } from "components";
// utils
import { testA11yAct } from "utils/testing/commonTests";

const skipNavComponent = (
  <SkipNav id="skip-nav-test" href="#main-content" text="Test text" />
);

describe("<SkipNav />", () => {
  test("SkipNav is visible and focusable", async () => {
    render(skipNavComponent);
    const skipNav = document.getElementById("skip-nav-test")!;
    skipNav.focus();

    const skipNavLink = screen.getByText("Test text");
    await expect(skipNavLink).toHaveFocus();
    await expect(skipNavLink).toBeVisible();
  });

  testA11yAct(skipNavComponent);
});
