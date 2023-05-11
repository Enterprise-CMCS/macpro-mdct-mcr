import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { TextAreaField } from "components";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
    register: () => {},
    getValues: jest.fn().mockReturnValue({}),
  }),
}));

const textAreaFieldComponent = (
  <TextAreaField
    name="testTextAreaField"
    label="test-label"
    placeholder="test-placeholder"
  />
);

describe("Test TextAreaField component", () => {
  test("TextAreaField is visible", () => {
    render(textAreaFieldComponent);
    const textAreaField = screen.getByText("test-label");
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
