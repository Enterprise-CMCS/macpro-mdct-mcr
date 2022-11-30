import { StickyBanner } from "./StickyBanner";
import { render } from "@testing-library/react";

describe("Sticky Banner", () => {
  test("Is Sticky Banner present", () => {
    const { getByTestId } = render(<StickyBanner />);
    const banner = getByTestId("stickyBanner");
    expect(banner).toBeVisible();
  });
});
