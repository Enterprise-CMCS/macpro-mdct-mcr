import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { TextAreaField } from "components";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
    register: () => {},
  }),
}));

const textAreaFieldComponent = (
  <TextAreaField
    name="testTextAreaField"
    label="test-label"
    placeholder="test-placeholder"
    data-testid="test-text-area-field"
  />
);

describe("Test TextAreaField component", () => {
  test("TextAreaField is visible", () => {
    render(textAreaFieldComponent);
    const textAreaField = screen.getByTestId("test-text-area-field");
    expect(textAreaField).toBeVisible();
  });
});

describe("Test TextAreaField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(textAreaFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
