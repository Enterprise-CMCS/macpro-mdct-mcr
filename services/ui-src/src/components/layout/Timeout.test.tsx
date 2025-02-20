import { ReactNode, useEffect, useState } from "react";
import {
  CSSObject,
  ModalContextProvider,
  StylesProvider,
} from "@chakra-ui/react";
import { refreshCredentials } from "utils/auth/authLifecycle";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  MockedFunction,
  test,
  vi,
} from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { testA11y } from "utils/testing/commonTests";
// components
import { Timeout } from "components";
// constants
import { IDLE_WINDOW, PROMPT_AT } from "../../constants";
// utils
import {
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { useStore, UserContext } from "utils";

const mockUserContext = {
  user: undefined,
  logout: vi.fn(),
  loginWithIDM: vi.fn(),
  updateTimeout: vi.fn(),
  getExpiration: vi.fn(),
};

const timeoutComponent = (
  <RouterWrappedComponent>
    <UserContext.Provider value={mockUserContext}>
      <Timeout />
    </UserContext.Provider>
  </RouterWrappedComponent>
);

vi.mock("utils/auth/authLifecycle", () => ({
  updateTimeout: vi.fn(),
  refreshCredentials: vi.fn(),
}));

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
});

vi.mock("@chakra-ui/react", async (importOriginal) => ({
  ...(await importOriginal()),
  /** This modal opens/closes instantly, making it easier to test than Chakra's */
  Modal: (props: {
    isOpen: boolean;
    onClose: () => {};
    children: ReactNode;
  }) => {
    const { isOpen, onClose, children } = props;
    const [wasOpen, setWasOpen] = useState(false);
    useEffect(() => {
      if (isOpen) setWasOpen(true);
      else if (wasOpen) onClose();
    }, [isOpen]);
    return (
      <StylesProvider value={{} as Record<string, CSSObject>}>
        <ModalContextProvider
          value={
            {
              getDialogProps: () => ({}),
              getDialogContainerProps: () => ({}),
              setHeaderMounted: () => ({}),
              setBodyMounted: () => ({}),
            } as any
          }
        >
          <div style={{ display: isOpen ? "block" : "none" }}>{children}</div>
        </ModalContextProvider>
      </StylesProvider>
    );
  },
}));

describe("<Timeout />", () => {
  describe("Renders", () => {
    beforeAll(() => {
      vi.useFakeTimers();
    });

    beforeEach(async () => {
      vi.clearAllMocks();
      vi.clearAllTimers();
      render(timeoutComponent);
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    test("Timeout modal is visible", async () => {
      vi.advanceTimersByTime(PROMPT_AT + 5000);
      expect(screen.getByText("Stay logged in")).toBeVisible();
      expect(screen.getByText("Log out")).toBeVisible();
    });

    test("Timeout modal refresh button is clickable and closes modal", async () => {
      vi.advanceTimersByTime(PROMPT_AT + 5000);
      const refreshButton = screen.getByText("Stay logged in");
      await act(async () => {
        await fireEvent.click(refreshButton);
      });
      expect(screen.getByText("Stay logged in")).not.toBeVisible();
      expect(screen.getByText("Log out")).not.toBeVisible();
      expect(refreshCredentials).toHaveBeenCalled();
    });

    test("Timeout modal logout button is clickable and triggers logout", async () => {
      vi.advanceTimersByTime(PROMPT_AT + 5000);
      const logoutButton = screen.getByText("Log out");
      await act(async () => {
        await fireEvent.click(logoutButton);
      });

      expect(mockUserContext.logout).toHaveBeenCalledTimes(1);
      expect(refreshCredentials).not.toHaveBeenCalled();
    });

    test("Timeout modal executes logout on timeout", async () => {
      await act(async () => {
        vi.advanceTimersByTime(10 * IDLE_WINDOW);
      });

      expect(mockUserContext.logout).toHaveBeenCalledTimes(1);
    });
  });

  testA11y(timeoutComponent);
});
