import { render, screen } from "@testing-library/react";
// components
import { TextAreaField } from "components";
// utils
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
    register: () => {},
    getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue("test"),
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

  testA11yAct(textAreaFieldComponent);
});
