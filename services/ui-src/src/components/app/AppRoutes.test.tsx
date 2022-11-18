import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { AppRoutes } from "components";
import { useUser, UserProvider } from "utils";
import { mockAdminUser, mockStateUser } from "utils/testing/setupJest";

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

jest.mock("aws-amplify", () => ({
  ...jest.requireActual("aws-amplify"),
  Hub: {
    listen: jest.fn(),
  },
}));

const appRoutesComponent = (history: any) => (
  <Router location={history.location} navigator={history}>
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  </Router>
);

let history: any;
const tempScroll = window.HTMLElement.prototype.scrollIntoView;

describe("brax Test AppRoutes for admin-specific routes", () => {
  beforeEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
    mockedUseUser.mockReturnValue(mockAdminUser);
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

describe("brax Test AppRoutes for non-admin-specific routes", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
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

describe("brax Test AppRoutes for non-admin-specific routes", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
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

describe("brax Test AppRoutes 404 handling", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    history = createMemoryHistory();
    history.push("/obviously-fake-route");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
  });

  test("not-found routes redirect to 404", () => {
    expect(screen.getByTestId("404-view")).toBeVisible();
  });
});
