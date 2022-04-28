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
    expect(screen.getByTestId("footer-container")).toBeVisible();
  });

  test("FAQ link is visible", () => {
    expect(screen.getByTestId("faq-link")).toBeVisible();
  });

  test("Accessibility statement link is visible", () => {
    expect(screen.getByTestId("accessibility-statement-link")).toBeVisible();
  });
});

describe("Test Footer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(footerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
