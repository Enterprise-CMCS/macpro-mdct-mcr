import { StickyBanner } from "./StickyBanner";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";

describe("Sticky Banner", () => {
  test("Is Sticky Banner present", async () => {
    const { getByTestId } = render(<StickyBanner />);
    const banner = getByTestId("stickyBanner");
    expect(banner).toBeVisible();
    const results = await axe(banner);
    expect(results).toHaveNoViolations();
  });
});
