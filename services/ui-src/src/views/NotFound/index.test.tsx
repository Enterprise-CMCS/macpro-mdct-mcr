import { NotFound } from "./index";
import { render } from "@testing-library/react";

describe("Test NotFound.tsx", () => {
  test("Check that the NotFound renders", () => {
    const { getByTestId } = render(<NotFound />);

    expect(getByTestId("not-found")).toBeVisible();
  });
});
