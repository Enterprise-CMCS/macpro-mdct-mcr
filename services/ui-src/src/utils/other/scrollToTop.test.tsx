import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ScrollToTopComponent } from "./scrollToTop";
// utils
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const scrollToTopComponent = (
  <RouterWrappedComponent>
    <div data-testid="test-scroll-comp">
      <ScrollToTopComponent />
    </div>
  </RouterWrappedComponent>
);

describe("Test scrollToTop Component", () => {
  beforeEach(() => {
    render(scrollToTopComponent);
  });
  test("test scrollToTop renders", () => {
    expect(screen.getByTestId("test-scroll-comp")).toBeVisible;
  });
});

describe("Test scrollToTop Component accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(scrollToTopComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
