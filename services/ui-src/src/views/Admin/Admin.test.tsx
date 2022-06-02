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
      render(adminView(mockContextWithoutBanner));
    });
  });

  test("Check that /admin view renders", () => {
    expect(screen.getByTestId("admin-view")).toBeVisible();
  });

  test("Check that delete admin banner button does not render if there is not a current banner", () => {
    const deleteButton = screen.getByTestId("delete-admin-banner-button");
    expect(deleteButton).not.toBeVisible();
  });
});

describe("Test /admin view with banner", () => {
  beforeEach(async () => {
    await act(async () => {
      render(adminView(mockContextWithBanner));
    });
  });

  test("Check that /admin view renders", () => {
    expect(screen.getByTestId("admin-view")).toBeVisible();
  });

  test("Check that delete admin banner button renders if there is a current banner", () => {
    const deleteButton = screen.getByTestId("delete-admin-banner-button");
    expect(deleteButton).toBeVisible();
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
