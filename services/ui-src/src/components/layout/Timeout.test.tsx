import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// utils
import { mockStateUser, RouterWrappedComponent } from "utils/testing/setupJest";
import { initAuthManager, useUser } from "utils";
//components
import { Timeout } from "components";
import { PROMPT_AT } from "../../constants";

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

const spy = jest.spyOn(global, "setTimeout");

describe("Test Timeout Modal", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    mockedUseUser.mockReturnValue(mockUser);
    initAuthManager();
    await render(timeoutComponent);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    spy.mockClear();
  });

  test("Timeout modal is visible", async () => {
    await act(async () => {
      jest.advanceTimersByTime(PROMPT_AT + 5000);
    });
    await waitFor(() => {
      expect(screen.getByTestId("modal-refresh-button")).toBeVisible();
      expect(screen.getByTestId("modal-logout-button")).toBeVisible();
    });
  });

  test("Timeout modal refresh button is clickable and closes modal", async () => {
    await act(async () => {
      jest.runAllTimers();
    });
    const refreshButton = screen.getByTestId("modal-refresh-button");
    await act(async () => {
      await fireEvent.click(refreshButton);
    });
    await waitFor(() => {
      expect(screen.getByTestId("modal-refresh-button")).not.toBeVisible();
      expect(screen.getByTestId("modal-logout-button")).not.toBeVisible();
    });
  });

  test("Timeout modal logout button is clickable and triggers logout", async () => {
    await act(async () => {
      jest.runAllTimers();
    });
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
    initAuthManager();
    mockedUseUser.mockReturnValue(mockUser);
    const { container } = render(timeoutComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
