import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { TextField } from "components";

const textFieldComponent = (
  <TextField
    name="fake-title"
    label="fake-label"
    placeholder="fake-placeholder"
    data-testid="text-field"
  />
);

describe("Test TextField", () => {
  beforeEach(() => {
    render(textFieldComponent);
  });

  test("TextField is visible", () => {
    expect(screen.getByTestId("text-field")).toBeVisible();
  });
});

describe("Test TextField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(textFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
