import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
// components
import { PreviewBanner } from "components";
// types
import { AlertTypes } from "types";
// utils
import { testA11y } from "utils/testing/commonTests";

vi.mock("react-hook-form", () => ({
  useFormContext: () => ({
    getValues: vi.fn().mockReturnValue({
      bannerTitle: "Mock preview banner title",
      bannerDescription: "Mock preview banner description",
      bannerLink: "",
    }),
  }),
}));

const previewBannerComponent = <PreviewBanner status={AlertTypes.WARNING} />;

describe("<PreviewBanner />", () => {
  test("PreviewBanner is visible", () => {
    render(previewBannerComponent);
    expect(screen.getByText("Mock preview banner title")).toBeVisible();
    expect(screen.getByText("Mock preview banner description")).toBeVisible();
  });

  testA11y(previewBannerComponent);
});
