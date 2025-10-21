import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
// components
import { NumberField, ReportContext } from "components";
// types
import { ReportStatus } from "types";
// utils
import {
  mockMcparReportContext,
  mockMcparReportStore,
  mockStateUserStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

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
    getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
  }));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

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

describe("<NumberField />", () => {
  describe("Test Maskless NumberField", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("NumberField is visible", () => {
      mockGetValues(undefined);
      const result = render(numberFieldComponent);
      const numberFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testNumberField']"
      )!;
      expect(numberFieldInput).toBeVisible();
    });

    test("onChangeHandler updates unmasked field value", async () => {
      mockGetValues(undefined);
      const result = render(numberFieldComponent);
      const numberFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testNumberField']"
      )!;
      await act(async () => {
        await userEvent.type(numberFieldInput, "123");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("123");
      expect(numberFieldInput.value).toEqual("123");
    });
  });

  describe("Test Masked NumberField", () => {
    beforeEach(() => {
      mockGetValues(undefined);
    });
    test("onChangeHandler updates comma masked field value", async () => {
      const result = render(commaMaskedNumberFieldComponent);
      const numberFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testNumberField']"
      )!;
      await act(async () => {
        await userEvent.type(numberFieldInput, "123");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("123");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "12055");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("12,055");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "12055.99");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("12,055.99");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "-1234");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("-1,234");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "$$1234567890.10");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("$$1234567890.10");
    });

    test("onChangeHandler updates Currency masked field value", async () => {
      const result = render(currencyMaskedNumberFieldComponent);
      const numberFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testNumberField']"
      )!;
      await act(async () => {
        await userEvent.type(numberFieldInput, "123");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("123.00");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "5.99");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("5.99");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "1234.00");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("1,234.00");
    });

    test("onChangeHandler updates Percentage masked field value", async () => {
      const result = render(percentageMaskedNumberFieldComponent);
      const numberFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testNumberField']"
      )!;
      await act(async () => {
        await userEvent.type(numberFieldInput, "123");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("123");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "12055");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("12,055");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "12055.99");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("12,055.99");
    });

    test("onChangeHandler updates ratio field value", async () => {
      const result = render(ratioMaskedNumberFieldComponent);
      const numberFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testNumberField']"
      )!;
      await act(async () => {
        await userEvent.type(numberFieldInput, "123:123");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("123:123");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(
          numberFieldInput,
          "123,,,4567.1234567.1234:12,3456,7.1"
        );
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual(
        "123,,,4567.1234567.1234:12,3456,7.1"
      );
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(
          numberFieldInput,
          "123,,,4567.12345671234:12,3456,7.1"
        );
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual(
        "1,234,567.1234567123:1,234,567.1"
      );
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, ":");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual(":");
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
      expect(displayValue).toEqual("54,321");
    });

    test("If only hydrationValue exists, displayValue is set to it", () => {
      mockGetValues(undefined);
      const result = render(numberFieldComponentWithHydrationValue);
      const numberField: HTMLInputElement = result.container.querySelector(
        "[name='testNumberFieldWithHydrationValue']"
      )!;
      const displayValue = numberField.value;
      expect(displayValue).toEqual("12,345");
    });

    test("If both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
      mockGetValues(mockFormFieldValue);
      const result = render(numberFieldComponentWithHydrationValue);
      const numberField: HTMLInputElement = result.container.querySelector(
        "[name='testNumberFieldWithHydrationValue']"
      )!;
      const displayValue = numberField.value;
      expect(displayValue).toEqual("54,321");
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
      expect(displayValue).toEqual("12,345.00");
    });
  });

  describe("Test NumberField component autosaves", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("NumberField autosaves with typed value when stateuser, autosave true, and form is valid", async () => {
      mockTrigger.mockReturnValue(true);
      mockGetValues(undefined);
      render(numberFieldAutosavingComponent);
      const textField = screen.getByRole("textbox", { name: "test-label" });
      expect(textField).toBeVisible();
      await act(async () => {
        await userEvent.type(textField, "1234");
        await userEvent.tab();
      });
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledWith(
        {
          reportType: mockMcparReportContext.report.reportType,
          state: mockStateUserStore.user?.state,
          id: mockMcparReportContext.report.id,
        },
        {
          metadata: {
            status: ReportStatus.IN_PROGRESS,
            lastAlteredBy: mockStateUserStore.user?.full_name,
          },
          fieldData: { testNumberField: "1234" },
        }
      );
    });

    test("NumberField autosaves with default value when stateuser, autosave true, and form invalid", async () => {
      mockTrigger.mockReturnValue(false);
      mockGetValues(undefined);
      render(numberFieldAutosavingComponent);
      const textField = screen.getByRole("textbox", { name: "test-label" });
      expect(textField).toBeVisible();
      await act(async () => {
        await userEvent.type(textField, "    ");
        await userEvent.tab();
      });
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledWith(
        {
          reportType: mockMcparReportContext.report.reportType,
          state: mockStateUserStore.user?.state,
          id: mockMcparReportContext.report.id,
        },
        {
          metadata: {
            status: ReportStatus.IN_PROGRESS,
            lastAlteredBy: mockStateUserStore.user?.full_name,
          },
          fieldData: { testNumberField: "" },
        }
      );
    });

    test("NumberField does not autosave if autosave is false", async () => {
      mockGetValues(undefined);
      render(numberFieldComponent);
      const textField = screen.getByRole("textbox", { name: "test-label" });
      expect(textField).toBeVisible();
      await act(async () => {
        await userEvent.type(textField, "test value");
        await userEvent.tab();
      });
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(0);
    });
  });

  describe("Numberfield handles triggering validation", () => {
    const numberFieldComponentWithValidateOnRender = (
      <NumberField name="testNumberField" label="test-label" validateOnRender />
    );

    afterEach(() => {
      jest.clearAllMocks();
    });
    test("Blanking field triggers form validation", async () => {
      mockGetValues(undefined);
      render(numberFieldComponent);
      expect(mockTrigger).not.toHaveBeenCalled();
      const numberField = screen.getByRole("textbox", {
        name: "test-label",
      });
      expect(numberField).toBeVisible();
      await act(async () => {
        await userEvent.clear(numberField);
        await userEvent.tab();
      });
      expect(mockTrigger).toHaveBeenCalled();
    });

    test("Component with validateOnRender passed should validate on render", async () => {
      mockGetValues(undefined);
      render(numberFieldComponentWithValidateOnRender);
      expect(mockTrigger).toHaveBeenCalled();
    });
  });

  testA11yAct(numberFieldComponent, () => {
    mockGetValues(undefined);
  });
});
