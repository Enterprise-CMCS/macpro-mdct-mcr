import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, Mock, test, vi } from "vitest";
import { useFormContext } from "react-hook-form";
// components
import { RadioField } from "components";
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

const RadioFieldComponent = (
  <RadioField
    choices={mockChoices}
    label="Radio example"
    name="radio_choices"
    type="radio"
  />
);

describe("<RadioField />", () => {
  test("RadioField renders as Radio", () => {
    mockGetValues(undefined);
    render(RadioFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
  });

  test("RadioField allows checking radio choices", async () => {
    mockGetValues(undefined);
    render(RadioFieldComponent);
    const firstRadio = screen.getByLabelText("Choice 1") as HTMLInputElement;
    await userEvent.click(firstRadio);
    expect(mockSetValue).toHaveBeenCalledWith(
      "radio_choices",
      [{ key: "Choice 1", value: "Choice 1" }],
      { shouldValidate: true }
    );
  });

  testA11y(RadioFieldComponent, () => {
    mockGetValues(undefined);
  });
});
