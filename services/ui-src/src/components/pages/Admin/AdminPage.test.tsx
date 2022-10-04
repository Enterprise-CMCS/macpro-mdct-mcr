import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// components
import { AdminPage, AdminBannerContext } from "components";
// utils
import {
  RouterWrappedComponent,
  mockBannerData,
  mockBannerDataEmpty,
} from "utils/testing/setupJest";

const mockBannerMethods = {
  fetchAdminBanner: jest.fn(() => {}),
  writeAdminBanner: jest.fn(() => {}),
  deleteAdminBanner: jest.fn(() => {}),
};

const mockContextWithoutBanner = {
  ...mockBannerMethods,
  bannerData: mockBannerDataEmpty,
  errorData: null,
};

const mockContextWithBanner = {
  ...mockBannerMethods,
  bannerData: mockBannerData,
  errorData: null,
};

const adminView = (context: any) => (
  <RouterWrappedComponent>
    <AdminBannerContext.Provider value={context}>
      <AdminPage />
    </AdminBannerContext.Provider>
  </RouterWrappedComponent>
);

describe("Test AdminPage banner manipulation functionality", () => {
  it("Deletes current banner on delete button click", async () => {
    await act(async () => {
      await render(adminView(mockContextWithBanner));
    });
    const deleteButton = screen.getByText("Delete Current Banner");
    await userEvent.click(deleteButton);
    await waitFor(() =>
      expect(mockContextWithBanner.deleteAdminBanner).toHaveBeenCalled()
    );
  });
});

describe("Test AdminPage without banner", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(adminView(mockContextWithoutBanner));
    });
  });

  test("Check that AdminPage renders", () => {
    expect(screen.getByTestId("admin-view")).toBeVisible();
  });

  test("Check that current banner info does not render", () => {
    const currentBannerStatus = screen.queryByText("Status:");
    expect(currentBannerStatus).not.toBeInTheDocument();
  });

  test("Check that 'no current banner' text shows", () => {
    expect(
      screen.queryByText("There is no current banner")
    ).toBeInTheDocument();
  });
});

describe("Test AdminPage with banner", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(adminView(mockContextWithBanner));
    });
  });

  test("Check that AdminPage renders", () => {
    expect(screen.getByTestId("admin-view")).toBeVisible();
  });

  test("Check that current banner info renders", () => {
    const currentBannerStatus = screen.queryByText("Status:");
    expect(currentBannerStatus).toBeVisible();

    const deleteButton = screen.getByText("Delete Current Banner");
    expect(deleteButton).toBeVisible();
  });

  test("Check that 'no current banner' text does not show", () => {
    expect(
      screen.queryByText("There is no current banner")
    ).not.toBeInTheDocument();
  });
});

describe("Test AdminPage with active/inactive banner", () => {
  const currentTime = Date.now(); // 'current' time in ms since unix epoch
  const oneDay = 1000 * 60 * 60 * 24; // 1000ms * 60s * 60m * 24h = 86,400,000ms
  const context = mockContextWithBanner;

  test("Active banner shows 'active' status", async () => {
    context.bannerData.startDate = currentTime - oneDay;
    context.bannerData.endDate = currentTime + oneDay;
    await act(async () => {
      await render(adminView(context));
    });
    const currentBannerStatus = screen.getByText("Status:");
    expect(currentBannerStatus.textContent).toEqual("Status: Active");
  });

  test("Inactive banner shows 'inactive' status", async () => {
    context.bannerData.startDate = currentTime + oneDay;
    context.bannerData.endDate = currentTime + oneDay + oneDay;
    await act(async () => {
      await render(adminView(context));
    });
    const currentBannerStatus = screen.getByText("Status:");
    expect(currentBannerStatus.textContent).toEqual("Status: Inactive");
  });
});

describe("Test AdminPage delete banner error handling", () => {
  it("Displays error if deleteBanner throws error", async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const context = mockContextWithBanner;
    context.deleteAdminBanner = jest.fn(() => {
      throw new Error();
    });
    await act(async () => {
      await render(adminView(context));
    });
    const deleteButton = screen.getByText("Delete Current Banner");
    await userEvent.click(deleteButton);
    expect(screen.getByText("Error")).toBeVisible();
  });
});

describe("Test AdminPage accessibility", () => {
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
