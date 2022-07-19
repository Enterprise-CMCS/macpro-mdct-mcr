import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { Profile } from "routes";
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

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

// TESTS

describe("Test Profile view for admin users", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    render(profileView);
  });
  test("Check that Profile page renders properly", () => {
    expect(screen.getByTestId("profile-view")).toBeVisible();
  });

  test("Check that there is an banner editor button visible", () => {
    expect(screen.getByTestId("banner-admin-button")).toBeVisible();
  });

  test("Check that the state field is set to N/A", () => {
    expect(screen.getByText("State")).toBeVisible();
    expect(screen.getByText("N/A")).toBeVisible();
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
  test("Check that Profile page renders properly", () => {
    expect(screen.getByTestId("profile-view")).toBeVisible();
  });

  test("Check that state is visible and set accordingly", () => {
    expect(screen.getByText("State")).toBeVisible();
    expect(screen.getByText("MN")).toBeVisible();
  });

  test("Check that there is not an banner editor button", () => {
    expect(screen.queryByText("Banner Editor")).not.toBeInTheDocument();
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
