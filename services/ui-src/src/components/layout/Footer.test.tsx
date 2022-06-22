import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { Footer } from "components";

const footerComponent = (
  <RouterWrappedComponent>
    <Footer />
  </RouterWrappedComponent>
);

describe("Test Footer", () => {
  beforeEach(() => {
    render(footerComponent);
  });

  test("Footer is visible", () => {
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeVisible();
  });

  test("Help link is visible", () => {
    expect(screen.getByText("Contact Us")).toBeVisible();
  });

  test("Accessibility statement link is visible", () => {
    expect(screen.getByText("Accessibility Statement")).toBeVisible();
  });
});

describe("Test Footer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(footerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
