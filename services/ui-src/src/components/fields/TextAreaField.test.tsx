import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
// components
import { TextAreaField } from "components";
// utils
import { testA11y } from "utils/testing/commonTests";

vi.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
    register: () => {},
    getValues: vi.fn().mockReturnValueOnce([]).mockReturnValue("test"),
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

  testA11y(textAreaFieldComponent);
});
