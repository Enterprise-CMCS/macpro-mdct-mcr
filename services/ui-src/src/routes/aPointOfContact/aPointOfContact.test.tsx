import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { APointOfContact } from "routes";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const apocFormComponent = (
  <RouterWrappedComponent>
    <APointOfContact />
  </RouterWrappedComponent>
);

describe("Test APointOfContact view", () => {
  beforeEach(() => {
    render(apocFormComponent);
  });

  test("Check that APointOfContact view renders", () => {
    expect(screen.getByTestId("apointofcontact")).toBeVisible();
  });
});

describe("Test APointOfContact view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(apocFormComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
