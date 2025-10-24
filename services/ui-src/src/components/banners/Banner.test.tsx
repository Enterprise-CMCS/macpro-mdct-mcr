import { render, screen } from "@testing-library/react";
// components
import { Banner } from "components";
// types
import { AlertTypes } from "types";
// utils
import { testA11yAct } from "utils/testing/commonTests";

const bannerComponent = (
  <Banner
    bannerData={{
      status: AlertTypes.WARNING,
      title: "Test banner!",
      description: "This is for testing.",
    }}
  />
);

describe("<Banner />", () => {
  test("Banner is visible", () => {
    render(bannerComponent);
    expect(screen.getByText("Test banner!")).toBeVisible();
    expect(screen.getByText("This is for testing.")).toBeVisible();
  });

  testA11yAct(bannerComponent);
});
