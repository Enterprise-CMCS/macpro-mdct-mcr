import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { Header } from "components";

describe("Test Header", () => {
  beforeEach(() => {
    render(
      <RouterWrappedComponent>
        <Header handleLogout={() => {}} />
      </RouterWrappedComponent>
    );
  });

  test("Header is visible", () => {
    expect(screen.getByText("Logout")).toBeVisible();
  });

  test("Logo is visible", () => {
    expect(screen.getByTestId("app-logo")).toBeVisible();
  });
});

describe("Test Header accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(
      <RouterWrappedComponent>
        <Header handleLogout={() => {}} />
      </RouterWrappedComponent>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
