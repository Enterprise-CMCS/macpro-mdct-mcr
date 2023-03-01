import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// components
import { AdminDashSelector } from "components";
// utils
import { mockAdminUser, RouterWrappedComponent } from "utils/testing/setupJest";
import { useUser } from "utils";

// MOCKS

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const mockVerbiage = {
  header: "mock header",
  buttonLabel: "mock button label",
};

const adminDashSelectorView = (
  <RouterWrappedComponent>
    <AdminDashSelector verbiage={mockVerbiage} />
  </RouterWrappedComponent>
);

// TESTS

describe("Test AdminDashSelector view", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockAdminUser);
  });

  test("Check that AdminDashSelector view renders", () => {
    render(adminDashSelectorView);
    expect(screen.getByTestId("read-only-view")).toBeVisible();
  });

  test("Check that submit button is disabled if no report type is selected", () => {
    render(adminDashSelectorView);
    expect(screen.getByRole("button").hasAttribute("disabled")).toBeTruthy;
  });

  test("Form submits correctly", async () => {
    const result = render(adminDashSelectorView);
    const form = result.container;
    const dropdownInput = form.querySelector("[name='state']")!;
    await fireEvent.change(dropdownInput, { target: { value: "CA" } });
    const reportInput = form.querySelector("[name='report']")!;
    fireEvent.click(reportInput, { target: { value: "MCPAR" } });
    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);
    expect(window.location.pathname).toEqual("/mcpar");
  });
});

describe("Test AdminDashSelector view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(adminDashSelectorView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
