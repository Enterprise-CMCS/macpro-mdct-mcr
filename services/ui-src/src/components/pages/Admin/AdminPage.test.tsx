import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { AdminPage, AdminBannerContext } from "components";
// utils
import {
  RouterWrappedComponent,
  mockBannerData,
  mockBannerStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import { bannerErrors } from "verbiage/errors";

const mockBannerMethods = {
  fetchAdminBanner: jest.fn(() => {}),
  fetchAllBanners: jest.fn(() => {}),
  writeAdminBanner: jest.fn(() => {}),
  deleteAdminBanner: jest.fn(() => {}),
};

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const adminView = (context: any) => (
  <RouterWrappedComponent>
    <AdminBannerContext.Provider value={context}>
      <AdminPage />
    </AdminBannerContext.Provider>
  </RouterWrappedComponent>
);

const deleteButtonText = "Delete banner";

describe("<AdminPage />", () => {
  describe("Test AdminPage banner manipulation functionality", () => {
    test("Deletes current banner on delete button click", async () => {
      await act(async () => {
        mockedUseStore.mockReturnValue(mockBannerStore);
        await render(adminView(mockBannerMethods));
      });
      const deleteButton = screen.getByText(deleteButtonText);
      await waitFor(async () => {
        await userEvent.click(deleteButton);
        expect(mockBannerMethods.deleteAdminBanner).toHaveBeenCalled();
      });
    });
  });

  describe("Test AdminPage without banner", () => {
    beforeEach(async () => {
      await act(async () => {
        mockedUseStore.mockReturnValue({
          ...mockBannerStore,
          bannerData: undefined,
          allBanners: undefined,
        });
        await render(adminView(mockBannerMethods));
      });
    });

    test("Check that AdminPage renders", () => {
      expect(screen.getByTestId("admin-view")).toBeVisible();
    });

    test("Check that current banner info does not render", () => {
      const currentBannerStatus = screen.queryByText("Status:");
      expect(currentBannerStatus).not.toBeInTheDocument();
    });

    test("Check that 'no existing banners' text shows", async () => {
      expect(screen.getByText("There are no existing banners")).toBeVisible();
    });
  });

  describe("Test AdminPage with banner", () => {
    beforeEach(async () => {
      await act(async () => {
        mockedUseStore.mockReturnValue(mockBannerStore);
        await render(adminView(mockBannerMethods));
      });
    });

    test("Check that AdminPage renders", () => {
      expect(screen.getByTestId("admin-view")).toBeVisible();
    });

    test("Check that current banner info renders", () => {
      const currentBannerStatus = screen.queryByText("Status:");
      expect(currentBannerStatus).toBeVisible();

      const deleteButton = screen.getByText(deleteButtonText);
      expect(deleteButton).toBeVisible();
    });

    test("Check that 'no existing banners' text does not show", () => {
      expect(
        screen.queryByText("There are no existing banners")
      ).not.toBeInTheDocument();
    });
  });

  describe("Test AdminPage with active/inactive/scheduled banner", () => {
    const currentTime = Date.now(); // 'current' time in ms since unix epoch
    const oneDay = 1000 * 60 * 60 * 24; // 1000ms * 60s * 60m * 24h = 86,400,000ms
    const context = mockBannerMethods;
    mockedUseStore.mockReturnValue(mockBannerStore);

    test("Active banner shows 'active' status", async () => {
      const activeBannerData = {
        ...mockBannerData,
        startDate: currentTime - oneDay,
        endDate: currentTime + oneDay,
      };
      await act(async () => {
        mockedUseStore.mockReturnValue({
          ...mockBannerStore,
          allBanners: [activeBannerData],
        });
        await render(adminView(context));
      });
      const currentBannerStatus = screen.getByText("Status:");
      expect(currentBannerStatus.textContent).toEqual("Status: Active");
    });

    test("Inactive banner shows 'inactive' status", async () => {
      const inactiveBannerData = {
        ...mockBannerData,
        startDate: currentTime - oneDay - oneDay,
        endDate: currentTime - oneDay,
      };
      await act(async () => {
        mockedUseStore.mockReturnValue({
          ...mockBannerStore,
          allBanners: [inactiveBannerData],
        });
        await render(adminView(context));
      });
      const currentBannerStatus = screen.getByText("Status:");
      expect(currentBannerStatus.textContent).toEqual("Status: Expired");
    });

    test("Future banner shows 'Scheduled' status", async () => {
      const futureBannerData = {
        ...mockBannerData,
        startDate: currentTime + oneDay,
        endDate: currentTime + oneDay + oneDay,
      };
      await act(async () => {
        mockedUseStore.mockReturnValue({
          ...mockBannerStore,
          allBanners: [futureBannerData],
        });
        await render(adminView(context));
      });
      const currentBannerStatus = screen.getByText("Status:");
      expect(currentBannerStatus.textContent).toEqual("Status: Scheduled");
    });
  });

  describe("Test AdminPage delete banner error handling", () => {
    test("Displays error if deleteBanner throws error", async () => {
      await act(async () => {
        mockedUseStore.mockReturnValue({
          ...mockBannerStore,
          bannerErrorMessage: bannerErrors.DELETE_BANNER_FAILED,
        });
        await render(adminView(mockBannerMethods));
      });

      const deleteButton = screen.getByText(deleteButtonText);
      await act(async () => {
        await userEvent.click(deleteButton);
      });
      expect(
        screen.getByText("Current banner could not be deleted")
      ).toBeVisible();
    });
  });

  testA11yAct(adminView(mockBannerMethods));
});
