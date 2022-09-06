import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { useFormContext } from "react-hook-form";
import { NumberField } from "components";

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

const numberFieldComponent = (
  <NumberField name="testNumberField" label="test-label" />
);

const commaMaskedNumberFieldComponent = (
  <NumberField
    name="testNumberField"
    label="test-label"
    mask="comma-separated"
  />
);

const currencyMaskedNumberFieldComponent = (
  <NumberField name="testNumberField" label="test-label" mask="currency" />
);

const percentageMaskedNumberFieldComponent = (
  <NumberField name="testNumberField" label="test-label" mask="percentage" />
);

describe("Test Maskless NumberField", () => {
  test("NumberField is visible", () => {
    const result = render(numberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    expect(numberFieldInput).toBeVisible();
  });

  test("onChangeHandler updates unmasked field value", async () => {
    const result = render(numberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    await userEvent.type(numberFieldInput, "123");
    expect(numberFieldInput.value).toEqual("123");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("123");
  });
});

describe("Test Comma-Separated Masked NumberField", () => {
  test("onChangeHandler updates masked field value", async () => {
    const result = render(commaMaskedNumberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    await userEvent.type(numberFieldInput, "123");
    expect(numberFieldInput.value).toEqual("123");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("123");
    await userEvent.clear(numberFieldInput);
    await userEvent.type(numberFieldInput, "12055");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("12,055");
    await userEvent.clear(numberFieldInput);
    await userEvent.type(numberFieldInput, "12055.99");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("12,055.99");
  });
});

describe("Test Currency Masked NumberField", () => {
  test("onChangeHandler updates masked field value", async () => {
    const result = render(currencyMaskedNumberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    await userEvent.type(numberFieldInput, "123");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("123");
    await userEvent.clear(numberFieldInput);
    await userEvent.type(numberFieldInput, "5.99");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("5.99");
    await userEvent.clear(numberFieldInput);
    await userEvent.type(numberFieldInput, "1234.00");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("1,234");
  });
});

describe("Test Percentage Masked NumberField", () => {
  test("onChangeHandler updates masked field value", async () => {
    const result = render(percentageMaskedNumberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    await userEvent.type(numberFieldInput, "123");
    expect(numberFieldInput.value).toEqual("123");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("123");
    await userEvent.clear(numberFieldInput);
    await userEvent.type(numberFieldInput, "12055");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("12,055");
    await userEvent.clear(numberFieldInput);
    await userEvent.type(numberFieldInput, "12055.99");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("12,055.99");
  });
});

describe("Test NumberField hydration functionality", () => {
  const mockFormFieldValue = "54321";
  const mockHydrationValue = "12345";

  const numberFieldComponentWithHydrationValue = (
    <NumberField
      name="testNumberFieldWithHydrationValue"
      label="test-label"
      hydrate={mockHydrationValue}
      data-testid="test-id"
    />
  );

  test("If only formFieldValue exists, displayValue is set to it", () => {
    mockGetValues(mockFormFieldValue);
    const result = render(numberFieldComponent);
    const numberField: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    const displayValue = numberField.value;
    expect(displayValue).toEqual(mockFormFieldValue);
  });

  test("If only hydrationValue exists, displayValue is set to it", () => {
    mockGetValues(undefined);
    const result = render(numberFieldComponentWithHydrationValue);
    const numberField: HTMLInputElement = result.container.querySelector(
      "[name='testNumberFieldWithHydrationValue']"
    )!;
    const displayValue = numberField.value;
    expect(displayValue).toEqual(mockHydrationValue);
  });

  test("If both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
    mockGetValues(mockFormFieldValue);
    const result = render(numberFieldComponentWithHydrationValue);
    const numberField: HTMLInputElement = result.container.querySelector(
      "[name='testNumberFieldWithHydrationValue']"
    )!;
    const displayValue = numberField.value;
    expect(displayValue).toEqual(mockFormFieldValue);
  });
});

describe("Test NumberField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(numberFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
