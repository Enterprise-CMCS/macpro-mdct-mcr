import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { Sidebar } from "components";

const sidebarComponent = <Sidebar />;

describe("Test Sidebar", () => {
  beforeEach(() => {
    render(sidebarComponent);
  });

  test("Sidebar button is visible", () => {
    expect(screen.getByText("Trending")).toBeVisible();
  });
});

describe("Test Sidebar accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(sidebarComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
