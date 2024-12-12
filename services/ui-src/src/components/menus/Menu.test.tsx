import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { Menu } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { UserContext } from "utils";

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

describe("Test Menu", () => {
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
});

describe("Test Menu accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(menuComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
