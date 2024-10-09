import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
// utils
import { UserContext, UserProvider } from "utils";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { UserRoles } from "types/users";

const mockAuthPayload = {
  email: "test@email.com",
  given_name: "Test",
  family_name: "IsMe",
  ["custom:cms_roles"]: UserRoles.STATE_USER,
  ["custom:cms_state"]: "AL",
};

jest.mock("aws-amplify/auth", () => ({
  fetchAuthSession: jest.fn().mockReturnValue({
    idToken: () => ({
      payload: mockAuthPayload,
    }),
  }),
  configure: () => {},
  signOut: jest.fn().mockImplementation(() => {}),
  federatedSignIn: () => {},
}));

jest.mock("aws-amplify/utils", () => ({
  Hub: {
    listen: jest.fn(),
  },
}));

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
const mockReplace = jest.fn();

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
      replace: mockReplace,
      pathname: "/",
    },
    writable: true,
  });
};

const breakCheckAuthState = async () => {
  const mockAmplify = require("aws-amplify/auth");
  mockAmplify.fetchAuthSession = jest.fn().mockImplementation(() => {
    throw new Error();
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
      await act(async () => {
        const logoutButton = screen.getByTestId("logout-button");
        await userEvent.click(logoutButton);
      });
      expect(window.location.pathname).toEqual("/");
    });

    test("test login with IDM function", async () => {
      await act(async () => {
        const loginButton = screen.getByTestId("login-idm-button");
        await userEvent.click(loginButton);
      });
      expect(screen.getByTestId("testdiv")).toHaveTextContent("User Test");
    });
  });

  describe("Test UserProvider with production path", () => {
    test("test production authenticates with idm when current authenticated user throws an error", async () => {
      setWindowOrigin("mdctmcr.cms.gov");
      await breakCheckAuthState();
      await act(async () => {
        await render(testComponent);
      });
      expect(window.location.origin).toContain("mdctmcr.cms.gov");
      expect(screen.getByTestId("testdiv")).toHaveTextContent("User Test");
      expect(mockReplace).toHaveBeenCalled();
    });
  });

  describe("Test UserProvider with non-production path", () => {
    test("Non-production error state correctly sets showLocalLogins", async () => {
      setWindowOrigin("wherever");
      await breakCheckAuthState();
      await act(async () => {
        await render(testComponent);
      });
      expect(window.location.origin).toContain("wherever");
      const showLocalLogins = screen.getByTestId("show-local-logins");
      expect(showLocalLogins).toHaveTextContent("showLocalLogins is true");
    });
  });

  describe("Test UserProvider error handling", () => {
    it("Logs error to console if logout throws error", async () => {
      jest.spyOn(console, "log").mockImplementation(jest.fn());
      const spy = jest.spyOn(console, "log");

      const mockAmplify = require("aws-amplify/auth");
      mockAmplify.signOut = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      await act(async () => {
        render(testComponent);
      });
      await act(async () => {
        const logoutButton = screen.getByTestId("logout-button");
        await userEvent.click(logoutButton);
      });

      expect(spy).toHaveBeenCalled();
    });
  });
});
