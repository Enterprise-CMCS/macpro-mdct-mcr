import { render } from "@testing-library/react";
import { Header } from "components";
import { RouterWrappedComp } from "utils/testing";

describe("Test Header.tsx", () => {
  const screen = render(
    <RouterWrappedComp>
      <Header handleLogout={() => {}} />
    </RouterWrappedComp>
  );

  test("Check that the header exists", () => {
    expect(screen.getByText("Logout")).toBeVisible();
  });
});
