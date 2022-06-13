import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
// components
import { AdminBannerContext, AdminBannerProvider } from "./AdminBannerProvider";
// utils
import { mockBannerData } from "utils/testing/setupJest";

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
      {context.errorMessage && (
        <p data-testid="error-message">{context.errorMessage}</p>
      )}
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
      const fetchButton = screen.getByTestId("fetch-button");
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
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });
});

describe("Test AdminBannerProvider deleteAdminBanner method", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("deleteAdminBanner method calls API deleteBanner method", async () => {
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(1);

    await act(async () => {
      const deleteButton = screen.getByTestId("delete-button");
      await userEvent.click(deleteButton);
    });

    expect(mockAPI.deleteBanner).toHaveBeenCalledTimes(1);
    expect(mockAPI.deleteBanner).toHaveBeenCalledWith(mockBannerData.key);
    // 1 call on render + 1 call on button click
    await waitFor(() => expect(mockAPI.getBanner).toHaveBeenCalledTimes(2));
  });

  test("deleteAdminBanner method calls fetchAdminBanner method", async () => {
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(1);

    await act(async () => {
      const deleteButton = screen.getByTestId("delete-button");
      await userEvent.click(deleteButton);
    });

    /*
     * if fetchAdminBannerMethod has been called, then so has API getBannerMethod
     * 1 call on render + 1 call on button click
     */
    await waitFor(() => expect(mockAPI.getBanner).toHaveBeenCalledTimes(2));
  });
});

describe("Test AdminBannerProvider writeAdminBanner method", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("writeAdminBanner method calls API writeBanner method", async () => {
    await act(async () => {
      const writeButton = screen.getByTestId("write-button");
      await userEvent.click(writeButton);
    });
    expect(mockAPI.writeBanner).toHaveBeenCalledTimes(1);
    expect(mockAPI.writeBanner).toHaveBeenCalledWith(mockBannerData);
  });

  test("writeAdminBanner method calls fetchAdminBanner method", async () => {
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(1);

    await act(async () => {
      const writeButton = screen.getByTestId("write-button");
      await userEvent.click(writeButton);
    });

    /*
     * if fetchAdminBannerMethod has been called, then so has API getBannerMethod
     * 1 call on render + 1 call on button click
     */
    expect(mockAPI.getBanner).toHaveBeenCalledTimes(2);
  });
});
