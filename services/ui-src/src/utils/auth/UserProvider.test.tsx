import { useContext } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// utils
import { UserContext, UserProvider, useStore } from "utils";
import { mockUseStore, RouterWrappedComponent } from "utils/testing/setupJest";

const mockAuthenticateWithIDM = jest.fn();
const mockGetTokens = jest.fn();
const mockLogoutUser = jest.fn();

jest.mock("utils/api/apiLib", () => ({
  authenticateWithIDM: () => mockAuthenticateWithIDM(),
  getTokens: () => mockGetTokens(),
  logoutUser: () => mockLogoutUser(),
}));

jest.mock("utils/state/useStore");

const mockSetUser = jest.fn();
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockUseStore,
  setUser: mockSetUser,
});

// COMPONENTS

const TestComponent = () => {
  const { ...context } = useContext(UserContext);
  return (
    <div data-testid="testdiv">
      <button onClick={() => context.logout()} data-testid="logout-button">
        Logout
      </button>
      <button
        onClick={() => context.loginWithIDM()}
        data-testid="login-idm-button"
      >
        Log In with IDM
      </button>
      User Test
      <p data-testid="show-local-logins">
        {context.showLocalLogins
          ? "showLocalLogins is true"
          : "showLocalLogins is false"}
      </p>
    </div>
  );
};

const testComponent = (
  <RouterWrappedComponent>
    <UserProvider>
      <TestComponent />
    </UserProvider>
  </RouterWrappedComponent>
);

// HELPERS
const originalLocationDescriptor: any = Object.getOwnPropertyDescriptor(
  global,
  "location"
);

const setWindowOrigin = (windowOrigin: string) => {
  global.window = Object.create(window);
  Object.defineProperty(window, "location", {
    value: {
      assign: jest.fn(),
      origin: windowOrigin,
      pathname: "/",
    },
    writable: true,
  });
};

// TESTS

describe("<UserProvider />", () => {
  beforeAll(() => {
    setWindowOrigin("localhost");
  });

  afterAll(() => {
    Object.defineProperty(global, "location", originalLocationDescriptor);
  });

  describe("Test UserProvider", () => {
    beforeEach(async () => {
      await act(async () => {
        render(testComponent);
      });
    });

    test("child component renders", () => {
      expect(screen.getByTestId("testdiv")).toHaveTextContent("User Test");
    });

    test("test logout function", async () => {
      const logoutButton = screen.getByTestId("logout-button");
      await act(async () => {
        await userEvent.click(logoutButton);
      });
      expect(window.location.pathname).toEqual("/");
    });

    test("test login with IDM function", async () => {
      const loginButton = screen.getByTestId("login-idm-button");
      await act(async () => {
        await userEvent.click(loginButton);
      });
      expect(screen.getByTestId("testdiv")).toHaveTextContent("User Test");
    });
  });

  describe("Test UserProvider with production path", () => {
    test("test production authenticates with idm when current authenticated user throws an error", async () => {
      setWindowOrigin("mdctmcr.cms.gov");
      await act(async () => {
        render(testComponent);
      });
      expect(window.location.origin).toContain("mdctmcr.cms.gov");
      expect(screen.getByTestId("testdiv")).toHaveTextContent("User Test");
    });
  });

  describe("Test UserProvider with non-production path", () => {
    test("Non-production error state correctly sets showLocalLogins", async () => {
      setWindowOrigin("wherever");
      await act(async () => {
        render(testComponent);
      });
      expect(window.location.origin).toContain("wherever");
      const showLocalLogins = screen.getByTestId("show-local-logins");
      expect(showLocalLogins).toHaveTextContent("showLocalLogins is true");
    });
  });

  describe("Test UserProvider error handling", () => {
    test("Logs error to console if logout throws error", async () => {
      jest.spyOn(console, "log").mockImplementation(jest.fn());
      const spy = jest.spyOn(console, "log");

      mockLogoutUser.mockImplementation(() => {
        throw new Error();
      });

      await act(async () => {
        render(testComponent);
      });
      const logoutButton = screen.getByTestId("logout-button");
      await act(async () => {
        await userEvent.click(logoutButton);
      });

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  test("test check auth function", async () => {
    mockGetTokens.mockResolvedValue({
      idToken: {
        payload: {
          email: "email@address.com",
          given_name: "first",
          family_name: "last",
          "custom:cms_roles": "roles",
          "custom:cms_state": "ZZ",
        },
      },
    });
    await act(async () => {
      render(testComponent);
    });
    expect(mockSetUser).toHaveBeenCalledWith({
      email: "email@address.com",
      given_name: "first",
      family_name: "last",
      full_name: "first last",
      userRole: undefined,
      state: "ZZ",
      userIsAdmin: false,
      userIsReadOnly: false,
      userIsEndUser: false,
    });
  });
});
