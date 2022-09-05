import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// components
import { ReadOnly } from "routes";
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

const readOnlyView = (
  <RouterWrappedComponent>
    <ReadOnly verbiage={mockVerbiage} />
  </RouterWrappedComponent>
);

// TESTS

describe("Test Read Only view", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockAdminUser);
  });

  test("Check that Read Only view renders", () => {
    render(readOnlyView);
    expect(screen.getByTestId("read-only-view")).toBeVisible();
  });

  test("Form submits correctly", async () => {
    const result = render(readOnlyView);
    const form = result.container;
    const dropdownInput = form.querySelector("[name='ads-state']")!;
    await fireEvent.change(dropdownInput, { target: { value: "CA" } });
    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);
    expect(window.location.pathname).toEqual("/mcpar");
  });
});

describe("Test Read Only view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(readOnlyView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
