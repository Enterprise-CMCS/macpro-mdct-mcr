import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  MockedFunction,
  test,
  vi,
} from "vitest";
import { act } from "react-dom/test-utils";
// components
import { AdminBannerContext, AdminBannerProvider } from "./AdminBannerProvider";
// utils
import { useStore, deleteBanner, getBanner, writeBanner } from "utils";
import { mockBannerData } from "utils/testing/setupTests";
// verbiage
import { bannerErrors } from "verbiage/errors";

vi.mock("utils/api/requestMethods/banner", () => ({
  deleteBanner: vi.fn(),
  getBanner: vi.fn(),
  writeBanner: vi.fn(),
}));
const mockedGetBanner = getBanner as MockedFunction<typeof getBanner>;

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
    vi.clearAllMocks();
  });
  describe("test fetch banner method", () => {
    test("fetchAdminBanner method is called on load", async () => {
      expect(getBanner).toHaveBeenCalledTimes(1);
    });

    test("fetchAdminBanner method calls API getBanner method", async () => {
      expect(getBanner).toHaveBeenCalledTimes(1);
      await act(async () => {
        const fetchButton = screen.getByText("Fetch");
        await userEvent.click(fetchButton);
      });
      // 1 call on render + 1 call on button click
      await waitFor(() => expect(getBanner).toHaveBeenCalledTimes(2));
    });
    test("Shows error if fetchBanner throws error", async () => {
      mockedGetBanner.mockImplementation(() => {
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
      expect(deleteBanner).toHaveBeenCalledTimes(1);
      expect(deleteBanner).toHaveBeenCalledWith(mockBannerData.key);

      // 1 call on render + 1 call on button click
      await waitFor(() => expect(getBanner).toHaveBeenCalledTimes(2));
    });
  });

  describe("Test AdminBannerProvider writeAdminBanner method", () => {
    test("writeAdminBanner method calls API writeBanner method", async () => {
      await act(async () => {
        const writeButton = screen.getByText("Write");
        await userEvent.click(writeButton);
      });
      expect(writeBanner).toHaveBeenCalledTimes(1);
      expect(writeBanner).toHaveBeenCalledWith(mockBannerData);
    });
  });
});
