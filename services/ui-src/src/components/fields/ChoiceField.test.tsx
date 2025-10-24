import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
// components
import { ChoiceField } from "components";
// utils
import { testA11yAct } from "utils/testing/commonTests";

const mockRhfMethods = {
  register: () => {},
  setValue: () => {},
  getValues: jest.fn(),
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;
jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockRhfMethods),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: jest.fn().mockReturnValue(returnValue),
  }));
const mockOnChange = jest.fn();

const ChoiceFieldComponent = (inline = false) => (
  <ChoiceField
    name="checkbox_choice"
    label="Checkbox A"
    hint="checkbox a"
    inline={inline}
    onChange={mockOnChange}
  />
);

describe("<ChoiceField />", () => {
  test("ChoiceField renders as Checkbox with p tag", () => {
    render(ChoiceFieldComponent());
    const label = screen.getByText("Checkbox A");
    const choice = screen.getByRole("checkbox", { name: "Checkbox A" });
    expect(label.tagName).toBe("P");
    expect(choice).toHaveAttribute("aria-labelledby", "checkbox_choice");
  });

  test("ChoiceField renders as Checkbox with label tag", () => {
    render(ChoiceFieldComponent(true));
    const label = screen.getByText("Checkbox A");
    const choice = screen.getByRole("checkbox", { name: "Checkbox A" });
    expect(label.tagName).toBe("LABEL");
    expect(choice).toBeVisible();
  });

  test("ChoiceField calls onChange function successfully", async () => {
    render(ChoiceFieldComponent());
    const choice = screen.getByLabelText("Checkbox A") as HTMLInputElement;
    expect(choice.checked).toBe(false);
    await act(async () => {
      await userEvent.click(choice);
    });
    expect(choice.checked).toBe(true);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
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
      render(ChoiceFieldComponent());
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
  testA11yAct(ChoiceFieldComponent());
});
