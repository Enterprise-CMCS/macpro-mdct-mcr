import { useContext } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const mockMultiBannerData = [
  {
    ...mockBannerData,
    createdAt: 1704085200000, // Jan 01 2024 00:00:00 UTC
  },
  {
    ...mockBannerData,
    createdAt: 1704171600000, // Jan 02 2024 00:00:00 UTC
  },
];

const mockAPI = require("utils/api/requestMethods/banner");

const TestComponent = () => {
  const { ...context } = useContext(AdminBannerContext);
  return (
    <div>
      <button onClick={() => context.fetchAdminBanner()}>Fetch</button>
      <button onClick={() => context.fetchAllBanners()}>Fetch all</button>
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
  describe("test fetch banner methods", () => {
    test("fetchAdminBanner method is called on load", async () => {
      expect(mockAPI.getBanners).toHaveBeenCalledTimes(1);
    });

    test("fetchAllBanners method calls API getBanners method", async () => {
      expect(mockAPI.getBanners).toHaveBeenCalledTimes(1);
      const fetchButton = screen.getByText("Fetch all");
      await act(async () => {
        await userEvent.click(fetchButton);
      });
      // 1 call on render + 1 call on button click
      await waitFor(() => expect(mockAPI.getBanners).toHaveBeenCalledTimes(2));
    });

    test("fetchAdminBanner method calls API getBanners method", async () => {
      mockAPI.getBanners.mockImplementation(() => [mockBannerData]);
      expect(mockAPI.getBanners).toHaveBeenCalledTimes(1);
      const fetchButton = screen.getByText("Fetch");
      await act(async () => {
        await userEvent.click(fetchButton);
      });
      // 1 call on render + 1 call on button click
      await waitFor(() => expect(mockAPI.getBanners).toHaveBeenCalledTimes(2));
    });
    test("fetchAdminBanner method calls API getBanners method and filters/sorts without error", async () => {
      mockAPI.getBanners.mockImplementation(() => mockMultiBannerData);
      expect(mockAPI.getBanners).toHaveBeenCalledTimes(1);
      const fetchButton = screen.getByText("Fetch");
      await act(async () => {
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
      const deleteButton = screen.getByText("Delete");
      await act(async () => {
        await userEvent.click(deleteButton);
      });
      expect(mockAPI.deleteBanner).toHaveBeenCalledTimes(1);
      expect(mockAPI.deleteBanner).toHaveBeenCalledWith(mockBannerData.key);

      // 1 call on render + 1 call on button click
      await waitFor(() => expect(mockAPI.getBanners).toHaveBeenCalledTimes(3));
    });
  });

  describe("Test AdminBannerProvider writeAdminBanner method", () => {
    test("writeAdminBanner method calls API writeBanner method", async () => {
      const writeButton = screen.getByText("Write");
      await act(async () => {
        await userEvent.click(writeButton);
      });
      expect(mockAPI.writeBanner).toHaveBeenCalledTimes(1);
      expect(mockAPI.writeBanner).toHaveBeenCalledWith(mockBannerData);
    });
  });
});
