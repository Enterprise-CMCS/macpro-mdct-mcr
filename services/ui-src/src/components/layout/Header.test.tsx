import { render, screen } from "@testing-library/react";
import { useLocation } from "react-router-dom";
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

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
}));

describe("Test Header", () => {
  beforeEach(() => {
    render(headerComponent);
  });

  test("Header is visible", () => {
    const header = screen.getByRole("navigation");
    expect(header).toBeVisible();
  });

  test("Logo is visible", () => {
    expect(screen.getByAltText("MCR logo")).toBeVisible();
  });

  test("Help button is visible", () => {
    expect(screen.getByTestId("header-help-button")).toBeVisible();
  });

  test("Menu button is visible", () => {
    expect(screen.getByTestId("header-menu-dropdown-button")).toBeVisible();
  });
});

describe("Test Header Subnav", () => {
  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/mcpar" });
    render(headerComponent);
  });

  test("Subnav is visible on MCPAR report screens", () => {
    expect(screen.getByTestId("leave-form-button")).toBeVisible();
  });
});

describe("Test Header accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(headerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
