import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { AppRoutes } from "components";
import { ApiProvider } from "utils/api";

const adminUserRole = "mdctmcr-approver";
const stateUserRole = "mdctmcr-state-user";

const appRoutesComponent = (history: any, userRole: string) => (
  <Router location={history.location} navigator={history}>
    <ApiProvider>
      <AppRoutes userRole={userRole} />
    </ApiProvider>
  </Router>
);

describe("Test AppRoutes for admin-specific routes", () => {
  test.only("/admin is visible for admin user", () => {
    const history = createMemoryHistory();
    history.push("/admin");
    render(appRoutesComponent(history, adminUserRole));
    const currentPath = history.location.pathname;
    expect(currentPath).toEqual("/admin");
  });
});

describe("Test AppRoutes for user-specific routes", () => {
  test("/admin not visible for state user; redirects to /profile", () => {
    const history = createMemoryHistory();
    history.push("/admin");
    render(appRoutesComponent(history, stateUserRole));
    const currentPath = history.location.pathname;
    expect(currentPath).toEqual("/profile");
  });
});

describe("Test AppRoutes 404 handling", () => {
  test("not-found routes redirect to 404", () => {
    const history = createMemoryHistory();
    history.push("/obviously-fake-route");
    const { getByTestId } = render(appRoutesComponent(history, stateUserRole));
    expect(getByTestId("404")).toBeVisible();
  });
});
