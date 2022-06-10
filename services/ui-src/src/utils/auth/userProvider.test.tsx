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
    currentSession: jest
      .fn()
      .mockReturnValueOnce({
        getIdToken: () => {
          throw new Error("test error flow");
        },
      })
      .mockReturnValue({
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
    signOut: jest
      .fn()
      .mockImplementationOnce(() => {
        throw new Error("failed!");
      })
      .mockImplementation(() => {}),
    federatedSignIn: () => {},
  },
}));

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

describe("Test UserProvider with production path", () => {
  let originalLocationDescriptor: any;
  let federatedSignInSpy: any;
  beforeAll(async () => {
    federatedSignInSpy = jest.spyOn(Auth, "federatedSignIn");
    originalLocationDescriptor = Object.getOwnPropertyDescriptor(
      global,
      "location"
    );
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        origin: "mdctmcr.cms.gov",
      },
      writable: true,
    });
    await act(async () => {
      await render(testComponent);
    });
  });
  afterAll(() => {
    Object.defineProperty(global, "location", originalLocationDescriptor);
    federatedSignInSpy.mockRestore();
  });
  test("test production authenticates with idm when current authenticated user throws an error", () => {
    expect(window.location.origin).toContain("mdctmcr.cms.gov");
    expect(screen.getByTestId("testdiv")).toHaveTextContent("User Test");
    expect(federatedSignInSpy).toHaveBeenCalledTimes(1);
  });
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

  test("test logout function fails", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});

    await act(async () => {
      const logoutButton = screen.getByTestId("logout-button");
      await userEvent.click(logoutButton);
    });

    expect(window.alert).toHaveBeenCalledWith("failed!");
  });

  test("test logout function", async () => {
    // stash alert and define temporary mock for use by jest-dom
    const actualAlert = window.alert;
    window.alert = () => {};

    await act(async () => {
      const logoutButton = screen.getByTestId("logout-button");
      await userEvent.click(logoutButton);
    });
    expect(location.pathname).toEqual("/");

    // restore actual alert method
    window.alert = actualAlert;
  });

  test("test login with IDM function", async () => {
    await act(async () => {
      const loginButton = screen.getByTestId("login-idm-button");
      await userEvent.click(loginButton);
    });
    expect(screen.getByTestId("testdiv")).toHaveTextContent("User Test");
  });
});
