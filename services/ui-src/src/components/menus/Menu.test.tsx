import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { Menu } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { UserContext } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

const mockLogout = jest.fn();

const mockUserContext = {
  user: undefined,
  logout: mockLogout,
  loginWithIDM: jest.fn(),
  updateTimeout: jest.fn(),
  getExpiration: jest.fn(),
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
    await act(async () => {
      await userEvent.click(logoutButton);
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  testA11yAct(menuComponent);
});
