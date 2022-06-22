import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { AppRoutes } from "components";

const adminUserRole = "mdctmcr-approver";
const stateUserRole = "mdctmcr-state-user";

const appRoutesComponent = (history: any, userRole: string) => (
  <Router location={history.location} navigator={history}>
    <AppRoutes userRole={userRole} />
  </Router>
);

let history: any;

describe("Test AppRoutes for admin-specific routes", () => {
  beforeEach(async () => {
    history = createMemoryHistory();
    history.push("/admin");
    await act(async () => {
      await render(appRoutesComponent(history, adminUserRole));
    });
  });
  test("/admin is visible for admin user", async () => {
    const currentPath = history.location.pathname;
    expect(currentPath).toEqual("/admin");
  });
});

describe("Test AppRoutes for non-admin-specific routes", () => {
  beforeEach(async () => {
    history = createMemoryHistory();
    history.push("/admin");
    await act(async () => {
      await render(appRoutesComponent(history, stateUserRole));
    });
  });

  test("/admin not visible for state user; redirects to /profile", async () => {
    const currentPath = history.location.pathname;
    expect(currentPath).toEqual("/profile");
  });
});

describe("Test AppRoutes for non-admin-specific routes", () => {
  beforeEach(async () => {
    history = createMemoryHistory();
    history.push("/admin");
    await act(async () => {
      await render(appRoutesComponent(history, stateUserRole));
    });
  });

  test("/admin not visible for state user; redirects to /profile", async () => {
    const currentPath = history.location.pathname;
    expect(currentPath).toEqual("/profile");
  });
});

describe("Test AppRoutes 404 handling", () => {
  beforeEach(async () => {
    history = createMemoryHistory();
    history.push("/obviously-fake-route");
    await act(async () => {
      await render(appRoutesComponent(history, stateUserRole));
    });
  });

  test("not-found routes redirect to 404", () => {
    expect(screen.getByTestId("404-view")).toBeVisible();
  });
});
