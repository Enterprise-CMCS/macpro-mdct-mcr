import { fireEvent, render } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import {
  mockAdminUser,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
// views
import { Profile } from "../index";

const profileView = (
  <RouterWrappedComponent>
    <Profile />
  </RouterWrappedComponent>
);

// MOCKS

jest.mock("utils/auth", () => ({
  useUser: jest
    .fn()
    .mockReturnValueOnce(mockAdminUser)
    .mockReturnValueOnce(mockAdminUser)
    .mockReturnValueOnce(mockAdminUser)
    .mockReturnValue(mockStateUser),
}));

// TESTS

describe("Test Profile view for admin users", () => {
  test("Check that Profile page renders for admin users", () => {
    const { getByTestId } = render(profileView);
    expect(getByTestId("profile-view")).toBeVisible();
  });

  test("Check that admin button is visible", () => {
    const { getByTestId } = render(profileView);
    expect(getByTestId("admin-button")).toBeVisible();
  });

  test("Check that admin button navigates to /admin on click", () => {
    const { getByTestId } = render(profileView);
    const adminButton = getByTestId("admin-button");
    expect(adminButton).toBeVisible();
    fireEvent.click(adminButton);
    expect(window.location.pathname).toEqual("/admin");
  });
});

describe("Test Profile view for state users", () => {
  test("Check that Profile page renders for state users", () => {
    const { getByTestId } = render(profileView);
    expect(getByTestId("profile-view")).toBeVisible();
  });

  test("Check that user state is visible", () => {
    const { getByTestId } = render(profileView);
    expect(getByTestId("statetestid")).toBeVisible();
  });
});

describe("Test Profile view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(profileView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
