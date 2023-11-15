import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ProfilePage } from "components";
// utils
import {
  mockAdminUser,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// verbiage
import verbiage from "verbiage/pages/profile";

const ProfilePageComponent = (
  <RouterWrappedComponent>
    <ProfilePage />
  </RouterWrappedComponent>
);

// MOCKS

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

// TESTS

describe("Test ProfilePage for admin users", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockAdminUser);
    render(ProfilePageComponent);
  });
  test("Check that Profile page renders properly", () => {
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
  });

  test("Check that there is an banner editor button visible", () => {
    expect(screen.getByText("Banner Editor")).toBeVisible();
  });

  test("Check that the state field is set to N/A", () => {
    expect(screen.getByText("State")).toBeVisible();
    expect(screen.getByText("N/A")).toBeVisible();
  });

  test("Check that admin button navigates to /admin on click", async () => {
    const adminButton = screen.getByText("Banner Editor");
    expect(adminButton).toBeVisible();
    await userEvent.click(adminButton);
    expect(window.location.pathname).toEqual("/admin");
  });
});

describe("Test ProfilePage for state users", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockStateUser);
    render(ProfilePageComponent);
  });
  test("Check that Profile page renders properly", () => {
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
  });

  test("Check that state is visible and set accordingly", () => {
    expect(screen.getByText("State")).toBeVisible();
    expect(screen.getByText("MN")).toBeVisible();
  });

  test("Check that there is not an banner editor button", () => {
    expect(screen.queryByText("Banner Editor")).not.toBeInTheDocument();
  });
});

describe("Test ProfilePage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockAdminUser);
    const { container } = render(ProfilePageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
