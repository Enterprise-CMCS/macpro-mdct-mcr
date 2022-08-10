import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { SuccessfullySubmitted } from "routes";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const successSubmitView = (
  <RouterWrappedComponent>
    <SuccessfullySubmitted />
  </RouterWrappedComponent>
);

describe("Test /mcpar successfully-submitted view", () => {
  beforeEach(() => {
    render(successSubmitView);
  });

  test("Check that /mcpar successfully-submitted view renders", () => {
    expect(screen.getByTestId("success-submit-view")).toBeVisible();
  });
});

describe("Test /mcpar successfully-submitted view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(successSubmitView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
