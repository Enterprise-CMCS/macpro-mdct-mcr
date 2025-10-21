import { render, screen } from "@testing-library/react";
// components
import { Footer } from "components";
import { testA11yAct } from "utils/testing/commonTests";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const footerComponent = (
  <RouterWrappedComponent>
    <Footer />
  </RouterWrappedComponent>
);

describe("<Footer />", () => {
  describe("Renders", () => {
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

  testA11yAct(footerComponent);
});
