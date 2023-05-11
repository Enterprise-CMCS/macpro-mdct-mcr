import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { Banner } from "components";

const bannerComponent = (
  <Banner
    bannerData={{
      title: "Test banner!",
      description: "This is for testing.",
    }}
  />
);

describe("Test Banner Item", () => {
  beforeEach(() => {
    render(bannerComponent);
  });

  test("Banner is visible", () => {
    expect(screen.getByText("Test banner!")).toBeVisible();
    expect(screen.getByText("This is for testing.")).toBeVisible();
  });
});

describe("Test Banner accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(bannerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
