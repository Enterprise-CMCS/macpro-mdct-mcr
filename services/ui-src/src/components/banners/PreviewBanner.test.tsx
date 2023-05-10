import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { PreviewBanner } from "components";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    getValues: jest.fn().mockReturnValue({
      bannerTitle: "Mock preview banner title",
      bannerDescription: "Mock preview banner description",
      bannerLink: "",
    }),
  }),
}));

const previewBannerComponent = <PreviewBanner />;

describe("Test PreviewBanner Item", () => {
  beforeEach(() => {
    render(previewBannerComponent);
  });

  test("PreviewBanner is visible", () => {
    expect(screen.getByText("Mock preview banner title")).toBeVisible();
    expect(screen.getByText("Mock preview banner description")).toBeVisible();
  });
});

describe("Test PreviewBanner accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(previewBannerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
