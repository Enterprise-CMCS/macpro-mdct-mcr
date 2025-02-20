import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, Mock, test, vi } from "vitest";
import { useFormContext } from "react-hook-form";
// components
import { ChoiceField } from "components";
// utils
import { testA11y } from "utils/testing/commonTests";

const mockRhfMethods = {
  register: () => {},
  setValue: () => {},
  getValues: vi.fn(),
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
    getValues: vi.fn().mockReturnValue(returnValue),
  }));

const ChoiceFieldComponent = (
  <ChoiceField name="checkbox_choice" label="Checkbox A" hint="checkbox a" />
);

describe("<ChoiceField />", () => {
  test("ChoiceField renders as Checkbox", () => {
    render(ChoiceFieldComponent);
    const choice = screen.getByLabelText("Checkbox A");
    expect(choice).toBeVisible();
  });

  test("ChoiceField calls onChange function successfully", async () => {
    render(ChoiceFieldComponent);
    const choice = screen.getByLabelText("Checkbox A") as HTMLInputElement;
    expect(choice.checked).toBe(false);
    await userEvent.click(choice);
    expect(choice.checked).toBe(true);
  });

  describe("Test ChoiceField hydration functionality", () => {
    const mockFormFieldValue = true;
    const mockHydrationValue = true;
    const ChoiceFieldComponentWithHydrationValue = (
      <ChoiceField
        name="checkbox_choice"
        label="Checkbox B"
        hint="checkbox b"
        hydrate={mockHydrationValue}
      />
    );

    test("If only formFieldValue exists, displayValue is set to it", () => {
      mockGetValues(mockFormFieldValue);
      render(ChoiceFieldComponent);
      const choiceField: HTMLInputElement = screen.getByLabelText("Checkbox A");
      const displayValue = choiceField.value;
      expect(displayValue).toBeTruthy();
    });

    test("If only hydrationValue exists, displayValue is set to it", () => {
      mockGetValues(undefined);
      render(ChoiceFieldComponentWithHydrationValue);
      const choiceField: HTMLInputElement = screen.getByLabelText("Checkbox B");
      const displayValue = choiceField.value;
      expect(displayValue).toBeTruthy();
    });
  });
  testA11y(ChoiceFieldComponent);
});
