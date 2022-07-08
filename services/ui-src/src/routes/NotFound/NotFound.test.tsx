import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { NotFound } from "routes";

const notFoundView = <NotFound />;

describe("Test NotFound 404 view", () => {
  test("Check that NotFound 404 page renders", () => {
    const { getByTestId } = render(notFoundView);
    expect(getByTestId("404-view")).toBeVisible();
  });
});

describe("Test NotFound 404 view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(notFoundView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
