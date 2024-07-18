import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Error } from "components";
import error from "verbiage/pages/error";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const errorView = (
  <RouterWrappedComponent>
    <Error />
  </RouterWrappedComponent>
);

describe("Test Error view", () => {
  test("Check that Error page renders", () => {
    render(errorView);
    expect(screen.getByText(error.header)).toBeVisible();
  });
});

describe("Test Error view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(errorView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
