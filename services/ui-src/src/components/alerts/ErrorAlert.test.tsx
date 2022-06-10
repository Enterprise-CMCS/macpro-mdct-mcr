import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ErrorAlert } from "components";

const errorAlertComponent = (
  <ErrorAlert
    errorData={{ message: "test-message" }}
    data-testid="test-error-alert"
  />
);

describe("Test ErrorAlert component", () => {
  beforeEach(() => {
    render(errorAlertComponent);
  });

  test("ErrorAlert is visible", () => {
    expect(screen.getByTestId("test-error-alert")).toBeVisible();
  });
});

describe("Test ErrorAlert accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(errorAlertComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
