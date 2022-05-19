import { render, screen } from "@testing-library/react";
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

describe("Test App", () => {
  beforeEach(() => {
    render(appComponent);
  });

  test("App login page is visible", () => {
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
