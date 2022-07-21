import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { TextField } from "components";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
    register: () => {},
  }),
}));

const textFieldComponent = (
  <TextField
    name="testTextField"
    label="test-label"
    placeholder="test-placeholder"
    data-testid="test-text-field"
  />
);

describe("Test TextField component", () => {
  test("TextField is visible", () => {
    render(textFieldComponent);
    const textField = screen.getByTestId("test-text-field");
    expect(textField).toBeVisible();
  });
});

describe("Test TextField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(textFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
