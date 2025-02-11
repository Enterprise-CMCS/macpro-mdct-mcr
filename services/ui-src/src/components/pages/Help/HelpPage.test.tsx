import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
// components
import { HelpPage } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/help";

const helpView = (
  <RouterWrappedComponent>
    <HelpPage />
  </RouterWrappedComponent>
);

describe("<HelpPage />", () => {
  test("Check that HelpPage renders", () => {
    render(helpView);
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
  });
  testA11y(helpView);
});
