import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { useFormContext } from "react-hook-form";
import { DateField } from "components";

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

const dateFieldComponent = (
  <DateField
    name="testDateField"
    label="test-date-field"
    data-testid="test-date-field"
  />
);

describe("Test DateField basic functionality", () => {
  test("DateField is visible", () => {
    const result = render(dateFieldComponent);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateField']"
    )!;
    expect(dateFieldInput).toBeVisible();
  });

  test("onChange event fires handler when typing and stays even after blurred", async () => {
    const result = render(dateFieldComponent);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateField']"
    )!;
    await userEvent.type(dateFieldInput, "07/14/2022");
    await userEvent.tab();
    expect(dateFieldInput.value).toEqual("07/14/2022");
  });
});

describe("Test DateField hydration functionality", () => {
  const mockFormFieldValue = "7/1/2022";
  const mockHydrationValue = "1/1/2022";

  const dateFieldComponentWithHydrationValue = (
    <DateField
      name="testDateFieldWithHydrationValue"
      label="test-date-field-with-hydration-value"
      hydrate={mockHydrationValue}
    />
  );

  test("If only formFieldValue exists, displayValue is set to it", () => {
    mockGetValues(mockFormFieldValue);
    const result = render(dateFieldComponent);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateField']"
    )!;
    const displayValue = dateFieldInput.value;
    expect(displayValue).toEqual(mockFormFieldValue);
  });

  test("If only hydrationValue exists, displayValue is set to it", () => {
    mockGetValues(undefined);
    const result = render(dateFieldComponentWithHydrationValue);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateFieldWithHydrationValue']"
    )!;
    const displayValue = dateFieldInput.value;
    expect(displayValue).toEqual(mockHydrationValue);
  });

  test("If both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
    mockGetValues(mockFormFieldValue);
    const result = render(dateFieldComponentWithHydrationValue);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateFieldWithHydrationValue']"
    )!;
    const displayValue = dateFieldInput.value;
    expect(displayValue).toEqual(mockFormFieldValue);
  });
});

describe("Test DateField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dateFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
