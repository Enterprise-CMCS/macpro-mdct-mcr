import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// utils
import {
  mockStateUser,
  mockNoUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useUser } from "utils/auth";
//components
import { App } from "components";

jest.mock("utils/auth");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const appComponent = (
  <RouterWrappedComponent>
    <App />
  </RouterWrappedComponent>
);

describe("Test App", () => {
  test("App is visible", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    await act(async () => {
      await render(appComponent);
    });
    expect(screen.getByTestId("app-container")).toBeVisible();
  });

  test("App renders local logins if there is no user", async () => {
    mockedUseUser.mockReturnValue(mockNoUser);
    await act(async () => {
      await render(appComponent);
    });
    expect(screen.getByTestId("login-container")).toBeVisible();
  });
});

describe("App login page accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(appComponent);
    await act(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
