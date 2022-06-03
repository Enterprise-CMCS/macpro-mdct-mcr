import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
// components
import { AdminBannerContext, AdminBannerProvider } from "./AdminBannerProvider";
// constants
import { bannerId } from "../../utils/constants/constants";

const mockBannerData = {
  key: bannerId,
  title: "Yes here I am, a banner",
  description: "I have a description too thank you very much",
  startDate: 1640995200000, // 1/1/2022 00:00:00 UTC
  endDate: 1672531199000, // 12/31/2022 23:59:59 UTC
};

jest.mock("utils/api/requestMethods/banner", () => ({
  deleteBanner: jest.fn(() => {}),
  getBanner: jest.fn(() => {}),
  writeBanner: jest.fn(() => {}),
}));

const mockAPI = require("utils/api/requestMethods/banner");

const TestComponent = () => {
  const { ...context } = useContext(AdminBannerContext);
  return (
    <div data-testid="testdiv">
      <button
        onClick={() => context.fetchAdminBanner()}
        data-testid="fetch-button"
      >
        Fetch
      </button>
      <button
        onClick={() => context.writeAdminBanner(mockBannerData)}
        data-testid="write-button"
      >
        Write
      </button>
      <button
        onClick={() => context.deleteAdminBanner(mockBannerData.key)}
        data-testid="delete-button"
      >
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

describe("Test AdminBannerProvider fetchAdminBanner method", () => {
  beforeEach(async () => {
    await act(async () => {
      render(testComponent);
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
      const fetchButton = screen.getByTestId("fetch-button");
      userEvent.click(fetchButton);
    });
    // 1 call on render + 1 call on button click
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(2);
  });
});

describe("Test AdminBannerProvider deleteAdminBanner method", () => {
  beforeEach(async () => {
    await act(async () => {
      render(testComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("deleteAdminBanner method calls API deleteBanner method", async () => {
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(1);

    await act(async () => {
      const deleteButton = screen.getByTestId("delete-button");
      userEvent.click(deleteButton);
    });

    expect(mockAPI.deleteBanner).toHaveBeenCalledTimes(1);
    expect(mockAPI.deleteBanner).toHaveBeenCalledWith(mockBannerData.key);
    // 1 call on render + 1 call on button click
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(2);
  });

  test("deleteAdminBanner method calls fetchAdminBanner method", async () => {
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(1);

    await act(async () => {
      const deleteButton = screen.getByTestId("delete-button");
      userEvent.click(deleteButton);
    });

    /*
     * if fetchAdminBannerMethod has been called, then so has API getBannerMethod
     * 1 call on render + 1 call on button click
     */
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(2);
  });
});

describe("Test AdminBannerProvider writeAdminBanner method", () => {
  beforeEach(async () => {
    await act(async () => {
      render(testComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("writeAdminBanner method calls API writeBanner method", async () => {
    await act(async () => {
      const writeButton = screen.getByTestId("write-button");
      userEvent.click(writeButton);
    });
    expect(mockAPI.writeBanner).toHaveBeenCalledTimes(1);
    expect(mockAPI.writeBanner).toHaveBeenCalledWith(mockBannerData);
  });

  test("writeAdminBanner method calls fetchAdminBanner method", async () => {
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(1);

    await act(async () => {
      const writeButton = screen.getByTestId("write-button");
      userEvent.click(writeButton);
    });

    /*
     * if fetchAdminBannerMethod has been called, then so has API getBannerMethod
     * 1 call on render + 1 call on button click
     */
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(2);
  });
});
