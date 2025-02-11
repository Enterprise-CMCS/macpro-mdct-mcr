import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
// components
import { Menu } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { UserContext } from "utils";
import { testA11y } from "utils/testing/commonTests";

const mockLogout = vi.fn();

const mockUserContext = {
  user: undefined,
  logout: mockLogout,
  loginWithIDM: vi.fn(),
  updateTimeout: vi.fn(),
  getExpiration: vi.fn(),
};

const menuComponent = (
  <RouterWrappedComponent>
    <UserContext.Provider value={mockUserContext}>
      <Menu />
    </UserContext.Provider>
  </RouterWrappedComponent>
);

describe("<Menu />", () => {
  beforeEach(() => {
    render(menuComponent);
  });

  test("Menu button is visible", () => {
    expect(screen.getByAltText("Arrow down")).toBeVisible();
  });

  test("Menu button logout fires logout function", async () => {
    const logoutButton = screen.getByText("Log Out");
    await userEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  testA11y(menuComponent);
});
