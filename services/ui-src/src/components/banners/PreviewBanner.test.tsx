import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { PreviewBanner } from "components";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    getValues: jest.fn().mockReturnValue({
      title: "Mock preview banner title",
      description: "Mock preview banner description",
      link: "",
    }),
  }),
}));

const previewBannerComponent = (
  <PreviewBanner data-testid="test-preview-banner" />
);

describe("Test PreviewBanner Item", () => {
  beforeEach(() => {
    render(previewBannerComponent);
  });

  test("PreviewBanner is visible", () => {
    expect(screen.getByTestId("test-preview-banner")).toBeVisible();
  });
});

describe("Test PreviewBanner accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(previewBannerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
