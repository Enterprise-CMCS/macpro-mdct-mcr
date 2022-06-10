import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import {
  mockAdminUser,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useUser } from "utils/auth";
// views
import { Profile } from "../index";

const profileView = (
  <RouterWrappedComponent>
    <Profile />
  </RouterWrappedComponent>
);

// MOCKS

jest.mock("utils/auth");
const mockedUseUser = useUser as jest.Mock<typeof useUser>;

// TESTS

describe("Test Profile view for state users", () => {
  beforeEach(() => {
    mockedUseUser.mockImplementation((): any => mockStateUser);
  });

  test("Check that Profile page renders for state users", () => {
    render(profileView);
    expect(screen.getByTestId("profile-view")).toBeVisible();
  });

  test("Check that user state is visible", () => {
    render(profileView);
    expect(screen.getByText("State")).toBeVisible();
  });
});

describe("Test Profile view for admin users", () => {
  beforeEach(() => {
    mockedUseUser.mockImplementation((): any => mockAdminUser);
  });

  test("Check that Profile page renders for admin users", () => {
    render(profileView);
    expect(screen.getByTestId("profile-view")).toBeVisible();
  });

  test("Check that admin button is visible", () => {
    render(profileView);
    expect(screen.getByTestId("banner-admin-button")).toBeVisible();
  });

  test("Check that admin button navigates to /admin on click", () => {
    render(profileView);
    const adminButton = screen.getByTestId("banner-admin-button");
    expect(adminButton).toBeVisible();
    fireEvent.click(adminButton);
    expect(window.location.pathname).toEqual("/admin");
  });
});

describe("Test Profile view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockImplementation((): any => mockStateUser);
    const { container } = render(profileView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
