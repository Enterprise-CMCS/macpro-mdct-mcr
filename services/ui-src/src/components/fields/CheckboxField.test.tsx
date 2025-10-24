import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
// components
import { CheckboxField } from "components";
// utils
import { mockChoices } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const mockTrigger = jest.fn();
const mockSetValue = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: mockSetValue,
  getValues: jest.fn(),
  trigger: mockTrigger,
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
    getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
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
    await act(async () => {
      await userEvent.click(firstCheckbox);
    });
    expect(mockSetValue).toHaveBeenCalledWith(
      "checkbox_choices",
      [{ key: "Choice 1", value: "Choice 1" }],
      {
        shouldValidate: true,
      }
    );
  });

  testA11yAct(CheckboxFieldComponent, () => {
    mockGetValues(undefined);
  });
});
