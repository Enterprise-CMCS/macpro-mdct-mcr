import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { UserProvider } from "./userProvider";
import { UserContext } from "./userContext";
import { Auth } from "aws-amplify";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

jest.mock("aws-amplify", () => ({
  Auth: {
    currentSession: jest.fn().mockReturnValue({
      getIdToken: () => ({
        payload: {
          email: "test@email.com",
          given_name: "Test",
          family_name: "IsMe",
          ["custom:cms_roles"]: "mdctmcr-state-user",
          ["custom:cms_state"]: "AL",
        },
      }),
    }),
    configure: () => {},
    signOut: jest.fn().mockImplementation(() => {}),
    federatedSignIn: () => {},
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

const setWindowOrigin = (windowOrigin: string) => {
  global.window = Object.create(window);
  Object.defineProperty(window, "location", {
    value: {
      origin: windowOrigin,
    },
    writable: true,
  });
};

const breakCheckAuthState = async () => {
  const mockAmplify = require("aws-amplify");
  mockAmplify.Auth.currentSession = jest.fn().mockImplementation(() => {
    throw new Error();
  });
};

// TESTS

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
    expect(location.pathname).toEqual("/");
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
  const originalLocationDescriptor: any = Object.getOwnPropertyDescriptor(
    global,
    "location"
  );
  const federatedSignInSpy = jest.spyOn(Auth, "federatedSignIn");

  afterAll(() => {
    Object.defineProperty(global, "location", originalLocationDescriptor);
    federatedSignInSpy.mockRestore();
  });

  test("test production authenticates with idm when current authenticated user throws an error", async () => {
    await setWindowOrigin("mdctmcr.cms.gov");
    await breakCheckAuthState();
    await act(async () => {
      await render(testComponent);
    });
    expect(window.location.origin).toContain("mdctmcr.cms.gov");
    expect(screen.getByTestId("testdiv")).toHaveTextContent("User Test");
    expect(federatedSignInSpy).toHaveBeenCalledTimes(2);
  });
});

describe("Test UserProvider with non-production path", () => {
  const originalLocationDescriptor: any = Object.getOwnPropertyDescriptor(
    global,
    "location"
  );

  afterAll(() => {
    Object.defineProperty(global, "location", originalLocationDescriptor);
  });

  test("Non-production error state correctly sets showLocalLogins", async () => {
    await setWindowOrigin("wherever");
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

    const mockAmplify = require("aws-amplify");
    mockAmplify.Auth.signOut = jest.fn().mockImplementation(() => {
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
