import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { NumberField } from "components";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
    register: () => {},
  }),
}));

const numberFieldComponent = (
  <NumberField
    name="testNumberField"
    label="test-label"
    placeholder="123.00"
    data-testid="test-number-field"
  />
);

const commaMaskedNumberFieldComponent = (
  <NumberField
    name="testNumberField"
    label="test-label"
    placeholder="123.00"
    data-testid="test-number-field"
    mask="comma-separated"
  />
);

const currencyMaskedNumberFieldComponent = (
  <NumberField
    name="testNumberField"
    label="test-label"
    placeholder="123.00"
    data-testid="test-number-field"
    mask="currency"
  />
);

describe("Test Maskless NumberField component", () => {
  test("NumberField is visible", () => {
    const result = render(numberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    expect(numberFieldInput).toBeVisible();
    expect(numberFieldInput.value).toEqual("");
  });

  test("onChange event fires handler when typing", async () => {
    const result = render(numberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    await userEvent.type(numberFieldInput, "123");
    expect(numberFieldInput.value).toEqual("123");
  });

  test("onChange event fires handler when typing and stays even after blurred", async () => {
    const result = render(numberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    await userEvent.type(numberFieldInput, "123");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("123");
  });
});

describe("Test Comma-Separated Mask NumberField component", () => {
  test("NumberField is visible", () => {
    const result = render(commaMaskedNumberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    expect(numberFieldInput).toBeVisible();
    expect(numberFieldInput.value).toEqual("");
  });

  test("onChange event fires handler when typing", async () => {
    const result = render(commaMaskedNumberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    await userEvent.type(numberFieldInput, "123");
    expect(numberFieldInput.value).toEqual("123");
  });

  test("onChange event fires handler when typing and stays even after blurred", async () => {
    const result = render(commaMaskedNumberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    await userEvent.type(numberFieldInput, "123");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("123.00");
  });
});

describe("Test Currency Mask NumberField component", () => {
  test("NumberField is visible", () => {
    const result = render(currencyMaskedNumberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    expect(numberFieldInput).toBeVisible();
    expect(numberFieldInput.value).toEqual("");
  });

  test("onChange event fires handler when typing", async () => {
    const result = render(currencyMaskedNumberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    await userEvent.type(numberFieldInput, "123");
    expect(numberFieldInput.value).toEqual("123");
  });

  test("onChange event fires handler when typing and stays even after blurred", async () => {
    const result = render(currencyMaskedNumberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    await userEvent.type(numberFieldInput, "5.99");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("5.99");
  });
});

describe("Test NumberField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(numberFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
