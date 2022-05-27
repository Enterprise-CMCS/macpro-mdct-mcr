import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
//components
import { AppRoutes } from "components";

jest.mock("../banners/AdminBanner", () => ({
  AdminBanner: jest.fn(() => ({
    key: "",
    title: "",
    description: "",
    link: "",
    startDate: 0,
    endDate: 0,
    fetchAdminBanner: () => {},
    writeAdminBanner: () => {},
    deleteAdminBanner: () => {},
  })),
}));

const adminUserRole = "mdctmcr-approver";
const stateUserRole = "mdctmcr-state-user";

const appRoutesComponent = (history: any, userRole: string) => (
  <Router location={history.location} navigator={history}>
    <AppRoutes userRole={userRole} />
  </Router>
);

describe("Test AppRoutes for admin-specific routes", () => {
  test("/admin is visible for admin user", () => {
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
