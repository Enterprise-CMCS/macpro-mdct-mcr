import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
// components
import { AdminBannerContext, AdminBannerProvider } from "./AdminBannerProvider";
// utils
import { useStore } from "utils";
import { mockBannerData } from "utils/testing/setupJest";
// verbiage
import { bannerErrors } from "verbiage/errors";

jest.mock("utils/api/requestMethods/banner", () => ({
  deleteBanner: jest.fn(() => {}),
  getBanners: jest.fn(() => {}),
  writeBanner: jest.fn(() => {}),
}));

const mockAPI = require("utils/api/requestMethods/banner");

const TestComponent = () => {
  const { ...context } = useContext(AdminBannerContext);
  return (
    <div>
      <button onClick={() => context.fetchAdminBanner()}>Fetch</button>
      <button onClick={() => context.writeAdminBanner(mockBannerData)}>
        Write
      </button>
      <button onClick={() => context.deleteAdminBanner(mockBannerData.key)}>
        Delete
      </button>
    </div>
  );
};

const testComponent = (
  <AdminBannerProvider>
    <TestComponent />
  </AdminBannerProvider>
);

describe("<AdminBannerProvider />", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("test fetch banner method", () => {
    test("fetchAdminBanner method is called on load", async () => {
      expect(mockAPI.getBanners).toHaveBeenCalledTimes(1);
    });

    test("fetchAdminBanner method calls API getBanners method", async () => {
      expect(mockAPI.getBanners).toHaveBeenCalledTimes(1);
      await act(async () => {
        const fetchButton = screen.getByText("Fetch");
        await userEvent.click(fetchButton);
      });
      // 1 call on render + 1 call on button click
      await waitFor(() => expect(mockAPI.getBanners).toHaveBeenCalledTimes(2));
    });
    test("Shows error if fetchBanner throws error", async () => {
      mockAPI.getBanners.mockImplementation(() => {
        throw new Error();
      });
      await act(async () => {
        await render(testComponent);
      });
      expect(useStore.getState().bannerErrorMessage).toBe(
        bannerErrors.GET_BANNER_FAILED
      );
    });
  });
  describe("Test AdminBannerProvider deleteAdminBanner method", () => {
    test("deleteAdminBanner method calls API deleteBanner method", async () => {
      await act(async () => {
        const deleteButton = screen.getByText("Delete");
        await userEvent.click(deleteButton);
      });
      expect(mockAPI.deleteBanner).toHaveBeenCalledTimes(1);
      expect(mockAPI.deleteBanner).toHaveBeenCalledWith(mockBannerData.key);

      // 1 call on render + 1 call on button click
      await waitFor(() => expect(mockAPI.getBanners).toHaveBeenCalledTimes(2));
    });
  });

  describe("Test AdminBannerProvider writeAdminBanner method", () => {
    test("writeAdminBanner method calls API writeBanner method", async () => {
      await act(async () => {
        const writeButton = screen.getByText("Write");
        await userEvent.click(writeButton);
      });
      expect(mockAPI.writeBanner).toHaveBeenCalledTimes(1);
      expect(mockAPI.writeBanner).toHaveBeenCalledWith(mockBannerData);
    });
  });
});
