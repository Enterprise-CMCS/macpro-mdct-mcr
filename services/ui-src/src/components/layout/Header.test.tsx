import { render, screen } from "@testing-library/react";
// utils
import { RouterWrappedComp } from "utils/testing";
//components
import { Header } from "components";

describe("Test Header", () => {
  beforeEach(() => {
    render(
      <RouterWrappedComp>
        <Header handleLogout={() => {}} />
      </RouterWrappedComp>
    );
  });

  test("Header is visible", () => {
    expect(screen.getByText("Logout")).toBeVisible();
  });

  test("Logo is visible", () => {
    expect(screen.getByTestId("app-logo")).toBeVisible();
  });
});
