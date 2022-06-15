import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// views
import { Error } from "../index";

const errorView = <Error />;

describe("Test Error view", () => {
  test("Check that Error page renders", () => {
    const { getByTestId } = render(errorView);
    expect(getByTestId("error-view")).toBeVisible();
  });
});

describe("Test Error view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(errorView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
