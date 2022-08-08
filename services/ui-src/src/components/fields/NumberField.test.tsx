import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { NumberField } from "components";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
    register: () => {},
    getValues: () => {},
  }),
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

describe("Test NumberField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(numberFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
