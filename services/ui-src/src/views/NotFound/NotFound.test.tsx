import { render } from "@testing-library/react";
// views
import { NotFound } from "./NotFound";

describe("Test Not Found 404 view", () => {
  test("Check that 404 page renders", () => {
    const { getByTestId } = render(<NotFound />);
    expect(getByTestId("not-found")).toBeVisible();
  });
});
