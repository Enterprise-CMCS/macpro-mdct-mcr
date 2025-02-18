import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { describe, expect, MockedFunction, test, vi } from "vitest";
// components
import { App } from "components";
// utils
import { UserProvider, useStore } from "utils";
import {
  mockNoUserStore,
  RouterWrappedComponent,
  mockUseStore,
} from "utils/testing/setupTests";
import { testA11yAct } from "utils/testing/commonTests";

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const appComponent = (
  <RouterWrappedComponent>
    <UserProvider>
      <App />
    </UserProvider>
  </RouterWrappedComponent>
);

describe("<App />", () => {
  test("App is visible", async () => {
    await act(async () => {
      await render(appComponent);
    });
    expect(screen.getByTestId("app-container")).toBeVisible();
  });

  test("App renders local logins if there is no user", async () => {
    mockedUseStore.mockReturnValue(mockNoUserStore);
    await act(async () => {
      await render(appComponent);
    });
    expect(screen.getByTestId("login-container")).toBeVisible();
  });

  testA11yAct(appComponent);
});
