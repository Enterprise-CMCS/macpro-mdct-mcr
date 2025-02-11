import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  MockedFunction,
  test,
  vi,
} from "vitest";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
// components
import { AppRoutes } from "components";
// utils
import { UserProvider, useStore } from "utils";
import { useFlags } from "launchdarkly-react-client-sdk";
import {
  mockAdminUserStore,
  mockBannerStore,
  mockStateUserStore,
  mockMcparReportStore,
  mockMlrReportStore,
  mockNaaarReportStore,
} from "utils/testing/setupTests";
// verbiage
import notFoundVerbiage from "verbiage/pages/not-found";

vi.mock("utils/state/useStore", () => ({
  useStore: vi.fn(),
}));
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn().mockReturnValue({ naaarReport: false }),
}));
const mockedUseFlags = useFlags as MockedFunction<typeof useFlags>;

const appRoutesComponent = (history: any) => (
  <Router location={history.location} navigator={history}>
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  </Router>
);

let history: any;
const tempScroll = window.HTMLElement.prototype.scrollIntoView;

describe("<AppRoutes />", () => {
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

  describe("Test MCPAR and MLR report routes", () => {
    test("MCPAR routes load correctly", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockBannerStore,
        ...mockMcparReportStore,
      });
      history = createMemoryHistory();
      history.push("/mcpar");
      await act(async () => {
        await render(appRoutesComponent(history));
      });
      expect(
        screen.getByText("Managed Care Program Annual Report (MCPAR)")
      ).toBeVisible();
    });

    test("MLR routes load correctly", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockBannerStore,
        ...mockMlrReportStore,
      });
      history = createMemoryHistory();
      history.push("/mlr");
      await act(async () => {
        await render(appRoutesComponent(history));
      });
      expect(
        screen.getByText("Medicaid Medical Loss Ratio (MLR)")
      ).toBeVisible();
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

  describe("Test naaarReport feature flag functionality", () => {
    beforeEach(async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockBannerStore,
        ...mockNaaarReportStore,
      });
    });
    test("if naaarReport flag is true, NAAAR routes should be accesible to users", async () => {
      mockedUseFlags.mockReturnValueOnce({ naaarReport: true });
      history = createMemoryHistory();
      history.push("/naaar");
      await act(async () => {
        await render(appRoutesComponent(history));
      });
      expect(
        screen.getByText(
          "Network Adequacy and Access Assurances Report (NAAAR)"
        )
      ).toBeVisible();
    });

    test("if naaarReport flag is false, NAAAR routes should redirect to 404 Not Found page", async () => {
      history = createMemoryHistory();
      history.push("/naaar");
      await act(async () => {
        await render(appRoutesComponent(history));
      });
      expect(screen.getByText(notFoundVerbiage.header)).toBeVisible();
    });
  });
});
