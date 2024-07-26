import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ErrorAlert } from "components";
import { genericErrorContent } from "verbiage/errors";
import { ErrorVerbiage } from "types";

const error: ErrorVerbiage = {
  title: "We've run into a problem",
  description: genericErrorContent,
};

const errorAlertComponent = <ErrorAlert error={error} />;

describe("Test ErrorAlert component", () => {
  beforeEach(() => {
    render(errorAlertComponent);
  });

  test("ErrorAlert title is visible", () => {
    expect(screen.getByText(error.title)).toBeVisible();
  });

  test("ErrorAlert description is visible", () => {
    expect(screen.getByText(/Something went wrong on our end/)).toBeVisible();
  });
});

describe("Test ErrorAlert accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(errorAlertComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
