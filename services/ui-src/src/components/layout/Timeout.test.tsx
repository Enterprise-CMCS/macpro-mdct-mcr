import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// utils
import { mockStateUser, RouterWrappedComponent } from "utils/testing/setupJest";
import { initAuthManager, useUser } from "utils";
//components
import { Timeout } from "components";

const timeoutComponent = (
  <RouterWrappedComponent>
    <Timeout />
  </RouterWrappedComponent>
);

const mockLogout = jest.fn();

const mockUser = {
  ...mockStateUser,
  logout: mockLogout,
};

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

jest.useFakeTimers("legacy");
const spy = jest.spyOn(global, "setTimeout");

describe("Test Timeout Modal", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockUser);
    initAuthManager();
    await render(timeoutComponent);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    spy.mockClear();
  });

  test("Timeout modal is visible", () => {
    jest.runAllTimers();
    expect(screen.getByTestId("modal-refresh-button")).toBeVisible();
    expect(screen.getByTestId("modal-logout-button")).toBeVisible();
  });

  test("Timeout modal refresh button is clickable and closes modal", async () => {
    const refreshButton = screen.getByTestId("modal-refresh-button");
    await act(async () => {
      await fireEvent.click(refreshButton);
    });
    expect(screen.getByTestId("modal-refresh-button")).not.toBeVisible();
    expect(screen.getByTestId("modal-logout-button")).not.toBeVisible();
  });

  test("Timeout modal logout button is clickable and triggers logout", async () => {
    const logoutButton = screen.getByTestId("modal-logout-button");
    mockLogout.mockReset();
    await act(async () => {
      await fireEvent.click(logoutButton);
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

describe("Test Timeout Modal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockUser);
    const { container } = render(timeoutComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
