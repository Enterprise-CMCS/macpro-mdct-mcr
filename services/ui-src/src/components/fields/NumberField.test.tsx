import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { useFormContext } from "react-hook-form";
import { NumberField, ReportContext } from "components";
import { useUser } from "utils";
import { mockMcparReportContext, mockStateUser } from "utils/testing/setupJest";
import { ReportStatus } from "types";

const mockTrigger = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: () => {},
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
    getValues: jest.fn().mockReturnValue(returnValue),
  }));

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const numberFieldComponent = (
  <NumberField
    name="testNumberField"
    label="test-label"
    data-testid="test-number-field"
  />
);

const commaMaskedNumberFieldComponent = (
  <NumberField
    name="testNumberField"
    label="test-label"
    mask="comma-separated"
  />
);

const currencyMaskedNumberFieldComponent = (
  <NumberField name="testNumberField" label="" mask="currency" />
);

const percentageMaskedNumberFieldComponent = (
  <NumberField name="testNumberField" label="test-label" mask="percentage" />
);

const ratioMaskedNumberFieldComponent = (
  <NumberField name="testNumberField" label="test-label" mask="ratio" />
);

const numberFieldAutosavingComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <NumberField
      name="testNumberField"
      label="test-label"
      placeholder="test-placeholder"
      data-testid="test-number-field-autosave"
      autosave
    />
  </ReportContext.Provider>
);

describe("Test Maskless NumberField", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

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

describe("Test Masked NumberField", () => {
  test("onChangeHandler updates comma masked field value", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
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

  test("onChangeHandler updates Currency masked field value", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
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

  test("onChangeHandler updates Percentage masked field value", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
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

  test("onChangeHandler updates ratio field value", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const result = render(ratioMaskedNumberFieldComponent);
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    await userEvent.type(numberFieldInput, "123:123");
    expect(numberFieldInput.value).toEqual("123:123");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("123:123");
    await userEvent.clear(numberFieldInput);
    await userEvent.type(
      numberFieldInput,
      "123,,,4567.1234567.1234:12,3456,7.1"
    );
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual("1,234,567.12:1,234,567.1");
    await userEvent.clear(numberFieldInput);
    await userEvent.type(numberFieldInput, ":");
    await userEvent.tab();
    expect(numberFieldInput.value).toEqual(":");
  });
});

describe("Test NumberField hydration functionality", () => {
  const mockFormFieldValue = "54321";
  const mockHydrationValue = "12345";
  const mockCommaMaskedHydrationValue = "12,345";

  const numberFieldComponentWithHydrationValue = (
    <NumberField
      name="testNumberFieldWithHydrationValue"
      label="test-label"
      hydrate={mockHydrationValue}
      data-testid="test-id"
    />
  );

  const clearPropGivenAndTrueNumberField = (
    <NumberField
      name="testNumberField"
      label=""
      mask="currency"
      hydrate={mockHydrationValue}
      clear
    />
  );

  const clearPropGivenAndFalseNumberField = (
    <NumberField
      name="testNumberField"
      label=""
      mask="currency"
      hydrate={mockHydrationValue}
      clear={false}
    />
  );

  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  test("should set value to default if given clear prop and clear is set to true", () => {
    mockGetValues(undefined);

    const result = render(clearPropGivenAndTrueNumberField);
    const numberField: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    const displayValue = numberField.value;
    expect(displayValue).toEqual("");
  });

  test("should set value to hydrationvalue if given clear prop and clear is set to false", () => {
    mockGetValues(undefined);
    const result = render(clearPropGivenAndFalseNumberField);
    const numberField: HTMLInputElement = result.container.querySelector(
      "[name='testNumberField']"
    )!;
    const displayValue = numberField.value;
    expect(displayValue).toEqual(mockCommaMaskedHydrationValue);
  });
});

describe("Test NumberField component autosaves", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("NumberField autosaves with typed value when stateuser, autosave true, and form is valid", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockTrigger.mockReturnValue(true);
    mockGetValues(undefined);
    render(numberFieldAutosavingComponent);
    const textField = screen.getByRole("textbox", { name: "test-label" });
    expect(textField).toBeVisible();
    await userEvent.type(textField, "1234");
    await userEvent.tab();
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledWith(
      {
        reportType: mockMcparReportContext.report.reportType,
        state: mockStateUser.user?.state,
        id: mockMcparReportContext.report.id,
      },
      {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: mockStateUser.user?.full_name,
        },
        fieldData: { testNumberField: "1234" },
      }
    );
  });

  test("NumberField autosaves with default value when stateuser, autosave true, and form invalid", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockTrigger.mockReturnValue(false);
    mockGetValues(undefined);
    render(numberFieldAutosavingComponent);
    const textField = screen.getByRole("textbox", { name: "test-label" });
    expect(textField).toBeVisible();
    await userEvent.type(textField, "    ");
    await userEvent.tab();
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledWith(
      {
        reportType: mockMcparReportContext.report.reportType,
        state: mockStateUser.user?.state,
        id: mockMcparReportContext.report.id,
      },
      {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: mockStateUser.user?.full_name,
        },
        fieldData: { testNumberField: "" },
      }
    );
  });

  test("NumberField does not autosave if autosave is false", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockGetValues(undefined);
    render(numberFieldComponent);
    const textField = screen.getByRole("textbox", { name: "test-label" });
    expect(textField).toBeVisible();
    await userEvent.type(textField, "test value");
    await userEvent.tab();
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(0);
  });
});

describe("Test NumberField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(numberFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
