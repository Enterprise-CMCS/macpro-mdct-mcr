import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// views
import { NotFound } from "../index";

const notFoundView = <NotFound />;

describe("Test NotFound 404 view", () => {
  test("Check that NotFound 404 page renders", () => {
    const { getByTestId } = render(notFoundView);
    expect(getByTestId("404")).toBeVisible();
  });
});

describe("Test NotFound 404 view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(notFoundView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
