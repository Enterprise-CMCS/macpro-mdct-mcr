import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// utils
import { mockStateUser, RouterWrappedComponent } from "utils/testing/setupJest";
import { useUser } from "utils/auth";
//components
import { App } from "components";

jest.mock("utils/auth");
const mockedUseUser = useUser as jest.Mock<typeof useUser>;

const appComponent = (
  <RouterWrappedComponent>
    <App />
  </RouterWrappedComponent>
);

beforeEach(() => {
  mockedUseUser.mockImplementation((): any => mockStateUser);
});

describe("Test App", () => {
  test("App login page is visible", async () => {
    await act(async () => {
      await render(appComponent);
    });
    expect(screen.getByTestId("app-container")).toBeVisible();
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
