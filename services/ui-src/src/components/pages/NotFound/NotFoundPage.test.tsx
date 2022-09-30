import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { NotFoundPage } from "components";

const notFoundView = <NotFoundPage />;

describe("Test NotFoundPage (404)", () => {
  test("Check that page renders", () => {
    const { getByTestId } = render(notFoundView);
    expect(getByTestId("404-view")).toBeVisible();
  });
});

describe("Test NotFoundPage (404) accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(notFoundView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
