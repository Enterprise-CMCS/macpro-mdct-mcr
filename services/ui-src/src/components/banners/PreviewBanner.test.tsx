import { render, screen } from "@testing-library/react";
// components
import { PreviewBanner } from "components";
// types
import { AlertTypes } from "types";
// utils
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    getValues: jest.fn().mockReturnValue({
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

  testA11yAct(previewBannerComponent);
});
