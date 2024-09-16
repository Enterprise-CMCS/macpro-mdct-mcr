import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
// components
import { AppRoutes } from "components";
// utils
import { UserProvider, useStore } from "utils";
import {
  mockAdminUserStore,
  mockBannerStore,
  mockStateUserStore,
  mockMcparReportStore,
} from "utils/testing/setupJest";
// verbiage
import notFoundVerbiage from "verbiage/pages/not-found";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockBannerStore,
  ...mockMcparReportStore,
});

const appRoutesComponent = (history: any) => (
  <Router location={history.location} navigator={history}>
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  </Router>
);

let history: any;
const tempScroll = window.HTMLElement.prototype.scrollIntoView;

describe("Test AppRoutes for admin-specific routes", () => {
  beforeEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
    mockedUseStore.mockReturnValue({
      ...mockAdminUserStore,
      ...mockBannerStore,
    });
    history = createMemoryHistory();
    history.push("/admin");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
  });
  afterEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = tempScroll;
  });
  test("/admin is visible for admin user", async () => {
    const currentPath = history.location.pathname;
    expect(currentPath).toEqual("/admin");
  });
});

describe("Test AppRoutes for non-admin-specific routes", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockBannerStore,
    });
    history = createMemoryHistory();
    history.push("/admin");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
  });

  test("/admin not visible for state user; redirects to /profile", async () => {
    const currentPath = history.location.pathname;
    expect(currentPath).toEqual("/profile");
  });
});

describe("Test AppRoutes 404 handling", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockBannerStore,
    });
    history = createMemoryHistory();
    history.push("/obviously-fake-route");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
  });

  test("not-found routes redirect to 404", () => {
    expect(screen.getByText(notFoundVerbiage.header)).toBeVisible();
  });
});
