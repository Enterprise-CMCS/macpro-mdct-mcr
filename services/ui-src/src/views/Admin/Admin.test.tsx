import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// views
import { Admin } from "../index";
import { AdminBannerContext } from "components";

const mockBannerMethods = {
  fetchAdminBanner: jest.fn(() => {}),
  writeAdminBanner: jest.fn(() => {}),
  deleteAdminBanner: jest.fn(() => {}),
};

const mockContextWithoutBanner = {
  bannerData: {
    key: "",
    title: "",
    description: "",
    startDate: 0,
    endDate: 0,
  },
  ...mockBannerMethods,
};

const mockContextWithBanner = {
  bannerData: {
    key: "bannerId",
    title: "Yes here I am, a banner",
    description: "I have a description too thank you very much",
    startDate: 1640995200000, // 1/1/2022 00:00:00 UTC
    endDate: 1672531199000, // 12/31/2022 23:59:59 UTC
  },
  ...mockBannerMethods,
};

const adminView = (context: any) => (
  <RouterWrappedComponent>
    <AdminBannerContext.Provider value={context}>
      <Admin />
    </AdminBannerContext.Provider>
  </RouterWrappedComponent>
);

describe("Test /admin view without banner", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(adminView(mockContextWithoutBanner));
    });
  });

  test("Check that /admin view renders", () => {
    expect(screen.getByTestId("admin-view")).toBeVisible();
  });

  test("Check that current banner info does not render", () => {
    const currentBannerInfo = screen.queryByTestId("current-banner-info");
    expect(currentBannerInfo).not.toBeInTheDocument();

    const deleteButton = screen.getByTestId("delete-admin-banner-button");
    expect(deleteButton).not.toBeVisible();
  });

  test("Check that 'no current banner' text shows", () => {
    expect(
      screen.queryByText("There is no current banner")
    ).toBeInTheDocument();
  });
});

describe("Test /admin view with banner", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(adminView(mockContextWithBanner));
    });
  });

  test("Check that /admin view renders", () => {
    expect(screen.getByTestId("admin-view")).toBeVisible();
  });

  test("Check that current banner info renders", () => {
    const currentBannerInfo = screen.getByTestId("current-banner-info");
    expect(currentBannerInfo).toBeVisible();

    const deleteButton = screen.getByTestId("delete-admin-banner-button");
    expect(deleteButton).toBeVisible();
  });

  test("Check that 'no current banner' text does not show", () => {
    expect(
      screen.queryByText("There is no current banner")
    ).not.toBeInTheDocument();
  });
});

describe("Test /admin view with active/inactive banner", () => {
  const currentTime = Date.now(); // 'current' time in ms since unix epoch
  const oneDay = 1000 * 60 * 60 * 24; // 1000ms * 60s * 60m * 24h = 86,400,000ms
  const context = mockContextWithBanner;

  test("Active banner shows 'active' status", async () => {
    context.bannerData.startDate = currentTime - oneDay;
    context.bannerData.endDate = currentTime + oneDay;
    await act(async () => {
      await render(adminView(context));
    });
    const currentBannerStatus = screen.getByTestId("current-banner-status");
    expect(currentBannerStatus.textContent).toEqual("Status: Active");
  });

  test("Inactive banner shows 'inactive' status", async () => {
    context.bannerData.startDate = currentTime + oneDay;
    context.bannerData.endDate = currentTime + oneDay + oneDay;
    await act(async () => {
      await render(adminView(context));
    });
    const currentBannerStatus = screen.getByTestId("current-banner-status");
    expect(currentBannerStatus.textContent).toEqual("Status: Inactive");
  });
});

describe("Test /admin view accessibility", () => {
  it("Should not have basic accessibility issues without banner", async () => {
    const { container } = render(adminView(mockContextWithoutBanner));
    await act(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it("Should not have basic accessibility issues with banner", async () => {
    const { container } = render(adminView(mockContextWithBanner));
    await act(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
