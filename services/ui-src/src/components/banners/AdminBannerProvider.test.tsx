import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
// components
import { AdminBannerContext, AdminBannerProvider } from "./AdminBannerProvider";
// utils
import { mockBannerData } from "utils/testing/setupJest";
import { bannerErrors } from "verbiage/errors";

jest.mock("utils/api/requestMethods/banner", () => ({
  deleteBanner: jest.fn(() => {}),
  getBanner: jest.fn(() => {}),
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
      {context.errorMessage && <p>{context.errorMessage}</p>}
    </div>
  );
};

const testComponent = (
  <AdminBannerProvider>
    <TestComponent />
  </AdminBannerProvider>
);

describe("Test AdminBannerProvider fetchAdminBanner method", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetchAdminBanner method is called on load", async () => {
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(1);
  });

  test("fetchAdminBanner method calls API getBanner method", async () => {
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(1);
    await act(async () => {
      const fetchButton = screen.getByText("Fetch");
      await userEvent.click(fetchButton);
    });
    // 1 call on render + 1 call on button click
    await waitFor(() => expect(mockAPI.getBanner).toHaveBeenCalledTimes(2));
  });

  it("Shows error if fetchBanner throws error", async () => {
    mockAPI.getBanner.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    expect(screen.queryByText(bannerErrors.GET_BANNER_FAILED)).toBeVisible();
  });
});

describe("Test AdminBannerProvider deleteAdminBanner method", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("deleteAdminBanner method calls API deleteBanner method", async () => {
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const deleteButton = screen.getByText("Delete");
      await userEvent.click(deleteButton);
    });
    expect(mockAPI.deleteBanner).toHaveBeenCalledTimes(1);
    expect(mockAPI.deleteBanner).toHaveBeenCalledWith(mockBannerData.key);
    await waitFor(() => expect(mockAPI.getBanner).toHaveBeenCalledTimes(1));
  });
});

describe("Test AdminBannerProvider writeAdminBanner method", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("writeAdminBanner method calls API writeBanner method", async () => {
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const writeButton = screen.getByText("Write");
      await userEvent.click(writeButton);
    });
    expect(mockAPI.writeBanner).toHaveBeenCalledTimes(1);
    expect(mockAPI.writeBanner).toHaveBeenCalledWith(mockBannerData);
  });
});
