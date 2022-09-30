import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { HelpPage } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const helpView = (
  <RouterWrappedComponent>
    <HelpPage />
  </RouterWrappedComponent>
);

describe("Test HelpPage", () => {
  beforeEach(() => {
    render(helpView);
  });

  test("Check that HelpPage renders", () => {
    expect(screen.getByTestId("help-view")).toBeVisible();
  });
});

describe("Test HelpPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(helpView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
