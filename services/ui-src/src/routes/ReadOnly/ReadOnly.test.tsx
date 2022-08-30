import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReadOnly } from "routes";
// utils
import { mockAdminUser, RouterWrappedComponent } from "utils/testing/setupJest";
import { useUser } from "utils";

const mockVerbiage = {
  header: "mock header",
  buttonLabel: "mock button label",
};

const readOnlyView = (
  <RouterWrappedComponent>
    <ReadOnly verbiage={mockVerbiage} />
  </RouterWrappedComponent>
);

// MOCKS

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

describe("Test Read Only view", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    render(readOnlyView);
  });

  test("Check that Read Only view renders", () => {
    expect(screen.getByTestId("read-only-view")).toBeVisible();
  });
});

describe("Test Read Only view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(readOnlyView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
