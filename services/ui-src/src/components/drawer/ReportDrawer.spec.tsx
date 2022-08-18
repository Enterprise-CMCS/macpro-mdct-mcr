import { render } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ReportDrawer } from "components";

const drawerComponent = <ReportDrawer isOpen={true} form={{ fields: [] }} />;

// TODO: Test ReportDrawer rendering, opening, closing functionalities

describe("Test ReportDrawer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(drawerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
