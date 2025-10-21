import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
// components
import { Timeout } from "components";
// constants
import { IDLE_WINDOW, PROMPT_AT } from "../../constants";
// utils
import {
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { initAuthManager, useStore, UserContext } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

const mockLogout = jest.fn();
const mockLoginWithIDM = jest.fn();
const mockUpdateTimeout = jest.fn();
const mockGetExpiration = jest.fn();

const mockUser = {
  ...mockStateUserStore,
};

const mockUserContext = {
  user: undefined,
  logout: mockLogout,
  loginWithIDM: mockLoginWithIDM,
  updateTimeout: mockUpdateTimeout,
  getExpiration: mockGetExpiration,
};

const timeoutComponent = (
  <RouterWrappedComponent>
    <UserContext.Provider value={mockUserContext}>
      <Timeout />
    </UserContext.Provider>
  </RouterWrappedComponent>
);

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const spy = jest.spyOn(global, "setTimeout");

describe("<Timeout />", () => {
  describe("Renders", () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      mockedUseStore.mockReturnValue(mockUser);
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
        expect(screen.getByText("Stay logged in")).toBeVisible();
        expect(screen.getByText("Log out")).toBeVisible();
      });
    });

    test("Timeout modal refresh button is clickable and closes modal", async () => {
      await act(async () => {
        jest.advanceTimersByTime(PROMPT_AT + 5000);
      });
      const refreshButton = screen.getByText("Stay logged in");
      await act(async () => {
        await fireEvent.click(refreshButton);
      });
      await waitFor(() => {
        expect(screen.getByText("Stay logged in")).not.toBeVisible();
        expect(screen.getByText("Log out")).not.toBeVisible();
      });
    });

    test("Timeout modal logout button is clickable and triggers logout", async () => {
      await act(async () => {
        jest.advanceTimersByTime(PROMPT_AT + 5000);
      });
      const logoutButton = screen.getByText("Log out");
      mockLogout.mockReset();
      await act(async () => {
        await fireEvent.click(logoutButton);
      });
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
    test("Timeout modal executes logout on timeout", async () => {
      mockLogout.mockReset();

      await act(async () => {
        jest.advanceTimersByTime(10 * IDLE_WINDOW);
      });
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  testA11yAct(timeoutComponent, () => {
    initAuthManager();
    mockedUseStore.mockReturnValue(mockUser);
  });
});
