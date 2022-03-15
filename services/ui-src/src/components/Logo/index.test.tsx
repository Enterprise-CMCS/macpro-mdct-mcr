import { Logo } from "./index";
import { render } from "@testing-library/react";

describe("Test Logo.tsx", () => {
  test("Check that the QMRLogo renders", () => {
    const { getByTestId } = render(<Logo />);

    expect(getByTestId("qmr-logo")).toBeVisible();
  });
});
