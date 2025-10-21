import { render, screen } from "@testing-library/react";
// components
import { HelpPage } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
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
  testA11yAct(helpView);
});
