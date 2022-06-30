import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { Profile } from "views";
// utils
import {
  mockAdminUser,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useUser } from "utils";

const profileView = (
  <RouterWrappedComponent>
    <Profile />
  </RouterWrappedComponent>
);

// MOCKS

jest.mock("utils/auth");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

// TESTS

describe("Test Profile view for admin users", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    render(profileView);
  });
  test("Check that Profile page renders for admin users", () => {
    expect(screen.getByTestId("profile-view")).toBeVisible();
  });

  test("Check that admin button is visible", () => {
    expect(screen.getByTestId("banner-admin-button")).toBeVisible();
  });

  test("Check that admin button navigates to /admin on click", () => {
    const adminButton = screen.getByTestId("banner-admin-button");
    expect(adminButton).toBeVisible();
    fireEvent.click(adminButton);
    expect(window.location.pathname).toEqual("/admin");
  });
});

describe("Test Profile view for state users", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(profileView);
  });
  test("Check that Profile page renders for state users", () => {
    expect(screen.getByTestId("profile-view")).toBeVisible();
  });

  test("Check that user state is visible", () => {
    expect(screen.getByText("State")).toBeVisible();
  });
});

describe("Test Profile view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    const { container } = render(profileView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
