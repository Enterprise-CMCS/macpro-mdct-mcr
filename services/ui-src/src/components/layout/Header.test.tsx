import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { Header } from "components";

const headerComponent = (
  <RouterWrappedComponent>
    <Header handleLogout={() => {}} />
  </RouterWrappedComponent>
);

describe("Test Header", () => {
  beforeEach(() => {
    render(headerComponent);
  });

  test("Header is visible", () => {
    expect(screen.getByTestId("header-banner-container")).toBeVisible();
  });

  test("Logo is visible", () => {
    expect(screen.getByTestId("app-logo")).toBeVisible();
  });
});

describe("Test Header accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(headerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
