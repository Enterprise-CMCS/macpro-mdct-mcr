import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ErrorAlert } from "components";

const errorAlertComponent = <ErrorAlert error={"test-message"} />;

describe("Test ErrorAlert component", () => {
  beforeEach(() => {
    render(errorAlertComponent);
  });

  test("ErrorAlert is visible", () => {
    expect(screen.getByText("test-message")).toBeVisible();
  });
});

describe("Test ErrorAlert accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(errorAlertComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
