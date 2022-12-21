import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { StickyBanner } from "./StickyBanner";

const stickyBannerComponent = <StickyBanner />;

describe("Sticky Banner", () => {
  test("Is Sticky Banner present", async () => {
    render(stickyBannerComponent);
    const banner = screen.getByTestId("stickyBanner");
    expect(banner).toBeVisible();
  });

  test("Download PDF button should be visible", async () => {
    render(stickyBannerComponent);
    const printButton = screen.getByText("Download PDF");
    expect(printButton).toBeVisible();
    await userEvent.click(printButton);
  });
});

describe("Test Sticky Banner accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(stickyBannerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
