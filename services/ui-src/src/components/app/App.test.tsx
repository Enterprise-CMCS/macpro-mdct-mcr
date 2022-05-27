import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { App } from "components";

const appComponent = (
  <RouterWrappedComponent>
    <App />
  </RouterWrappedComponent>
);

jest.mock("utils/auth", () => ({
  useUser: jest.fn(() => {
    return {
      logout: () => {},
      user: true,
      showLocalLogins: true,
      loginWithIDM: () => {},
    };
  }),
}));

jest.mock("aws-amplify", () => ({
  API: {
    get: jest.fn(() => {
      return {};
    }),
  },
}));

jest.mock("utils/api/requestMethods/getRequestHeaders", () => ({
  getRequestHeaders: jest.fn(() => {
    return {
      "x-api-key": "",
    };
  }),
}));

describe("Test App", () => {
  test("App login page is visible", () => {
    act(() => {
      render(appComponent);
    });
    expect(screen.getByTestId("app-container")).toBeVisible();
  });
});

describe("App login page accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(appComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
