import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// views
import NotFound from "./NotFound";

const notFoundView = <NotFound />;

describe("Test Not Found 404 view", () => {
  test("Check that 404 page renders", () => {
    const { getByTestId } = render(notFoundView);
    expect(getByTestId("not-found")).toBeVisible();
  });
});

describe("Test Not Found 404 view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(notFoundView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
