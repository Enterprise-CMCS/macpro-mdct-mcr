import { act, render, screen } from "@testing-library/react";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
// components
import { AppRoutes, ReportContext } from "components";
// utils
import { UserProvider, useStore } from "utils";
import {
  mockAdminUserStore,
  mockBannerStore,
  mockMcparReportContext,
  mockMcparReportStore,
  mockMlrReportStore,
  mockNaaarReportStore,
  mockStateUserStore,
} from "utils/testing/setupJest";
// verbiage
import notFoundVerbiage from "verbiage/pages/not-found";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const appRoutesComponent = (history: any, isReportPage: boolean = false) => (
  <ReportContext.Provider
    value={{
      ...mockMcparReportContext,
      isReportPage,
    }}
  >
    <Router location={history.location} navigator={history}>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </Router>
  </ReportContext.Provider>
);

let history: any;

describe("<AppRoutes />", () => {
  describe("Test AppRoutes for admin-specific routes", () => {
    beforeEach(async () => {
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

  describe("Test MCPAR, MLR, and NAAAR report routes", () => {
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
        screen.getByRole("heading", {
          level: 1,
          name: "Minnesota Managed Care Program Annual Report (MCPAR)",
        })
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
        screen.getByRole("heading", {
          level: 1,
          name: "Minnesota Medicaid Medical Loss Ratio (MLR)",
        })
      ).toBeVisible();
    });

    test("NAAAR routes load correctly", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockBannerStore,
        ...mockNaaarReportStore,
      });
      history = createMemoryHistory();
      history.push("/naaar");
      await act(async () => {
        await render(appRoutesComponent(history));
      });
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: "Minnesota Network Adequacy and Access Assurances Report (NAAAR)",
        })
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

  describe("Test AppRoutes box container", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockBannerStore,
        ...mockMcparReportStore,
      });
    });

    test("container should be main element for non-report page", () => {
      history = createMemoryHistory();
      history.push("/mcpar");
      render(appRoutesComponent(history));
      expect(screen.getByTestId("main-content").tagName).toBe("MAIN");
      expect(screen.getByRole("main").id).toBe("main-content");
    });

    test("container should be div element for report page", () => {
      history = createMemoryHistory();
      history.push("/mock/mock-route-1");
      render(appRoutesComponent(history, true));
      expect(screen.getByTestId("main-content").tagName).toBe("DIV");
      expect(screen.getByRole("main").id).toBe("report-content");
    });
  });
});
