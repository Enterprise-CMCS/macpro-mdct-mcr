import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, Mock, test, vi } from "vitest";
import { useFormContext } from "react-hook-form";
// components
import { CheckboxField } from "components";
// utils
import { mockChoices } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

const mockTrigger = vi.fn();
const mockSetValue = vi.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: mockSetValue,
  getValues: vi.fn(),
  trigger: mockTrigger,
};
const mockUseFormContext = useFormContext as unknown as Mock<
  typeof useFormContext
>;
vi.mock("react-hook-form", () => ({
  useFormContext: vi.fn(() => mockRhfMethods),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: vi.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
  }));

const CheckboxFieldComponent = (
  <CheckboxField
    choices={mockChoices}
    label="Checkbox example"
    name="checkbox_choices"
    type="checkbox"
  />
);

describe("<CheckboxField />", () => {
  test("CheckboxField renders as Checkbox", () => {
    mockGetValues(undefined);
    render(CheckboxFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
  });

  test("CheckboxField allows checking checkbox choices", async () => {
    mockGetValues(undefined);
    render(CheckboxFieldComponent);
    const firstCheckbox = screen.getByLabelText("Choice 1") as HTMLInputElement;
    await userEvent.click(firstCheckbox);
    expect(mockSetValue).toHaveBeenCalledWith(
      "checkbox_choices",
      [{ key: "Choice 1", value: "Choice 1" }],
      {
        shouldValidate: true,
      }
    );
  });

  testA11y(CheckboxFieldComponent, () => {
    mockGetValues(undefined);
  });
});
