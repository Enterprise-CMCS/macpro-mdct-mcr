import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { initAuthManager } from "utils";
//components
import { Timeout } from "components";

const timeoutComponent = (
  <RouterWrappedComponent>
    <Timeout />
  </RouterWrappedComponent>
);

jest.useFakeTimers("legacy");
const spy = jest.spyOn(global, "setTimeout");

describe("Test Timeout Modal", () => {
  beforeEach(async () => {
    initAuthManager();
    await render(timeoutComponent);
    jest.runAllTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    spy.mockClear();
  });

  test("Timeout modal is visible", () => {
    expect(screen.getByTestId("modal-refresh-button")).toBeVisible();
    expect(screen.getByTestId("modal-logout-button")).toBeVisible();
  });

  test("Timeout modal refresh button is clickable and closes modal", async () => {
    const refreshButton = screen.getByTestId("modal-refresh-button");
    await act(() => refreshButton.click());
    expect(screen.getByTestId("modal-refresh-button")).not.toBeVisible();
    expect(screen.getByTestId("modal-logout-button")).not.toBeVisible();
  });

  test("Timeout modal logout button is clickable and closes modal", async () => {
    const logoutButton = screen.getByTestId("modal-logout-button");
    await act(() => logoutButton.click());
    expect(screen.getByTestId("modal-refresh-button")).not.toBeVisible();
    expect(screen.getByTestId("modal-logout-button")).not.toBeVisible();
  });
});

describe("Test Timeout Modal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(timeoutComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
