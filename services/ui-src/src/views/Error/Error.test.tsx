import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// views
import { Error } from "../index";

const notFoundView = <Error />;

describe("Test Error view", () => {
  test("Check that Error page renders", () => {
    const { getByTestId } = render(notFoundView);
    expect(getByTestId("error-view")).toBeVisible();
  });
});

describe("Test Error view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(notFoundView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
