import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { Apoc } from "routes";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const apocFormComponent = (
  <RouterWrappedComponent>
    <Apoc />
  </RouterWrappedComponent>
);

describe("Test Apoc view", () => {
  beforeEach(() => {
    render(apocFormComponent);
  });

  test("Check that Apoc view renders", () => {
    expect(screen.getByTestId("apointofcontact")).toBeVisible();
  });
});

describe("Test Apoc view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(apocFormComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
