import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
// components
import { DateField, ReportContext } from "components";
// types
import { ReportStatus } from "types";
// utils
import {
  mockMcparReportContext,
  mockMcparReportStore,
  mockStateUserStore,
} from "utils/testing/setupJest";
import { useFieldWarning, useStore } from "utils";
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
  useWatch: jest.fn().mockReturnValue(undefined),
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

jest.mock("utils/warnings/useFieldWarning", () => ({
  useFieldWarning: jest.fn().mockReturnValue(null),
}));
const mockUseFieldWarning = useFieldWarning as jest.Mock;

const dateFieldComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <DateField name="testDateField" label="test-date-field" />
  </ReportContext.Provider>
);

const dateFieldAutosavingComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <DateField name="testDateField" label="test-date-field" autosave />
  </ReportContext.Provider>
);

describe("<DateField />", () => {
  describe("Test DateField basic functionality", () => {
    test("DateField is visible", () => {
      mockGetValues(undefined);
      const result = render(dateFieldComponent);
      const dateFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testDateField']"
      )!;
      expect(dateFieldInput).toBeVisible();
    });

    test("onChange event fires handler when typing and stays even after blurred", async () => {
      mockGetValues(undefined);
      const result = render(dateFieldComponent);
      const dateFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testDateField']"
      )!;
      await act(async () => {
        await userEvent.type(dateFieldInput, "07/14/2022");
        await userEvent.tab();
      });
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

    const clearPropGivenAndTrueDateField = (
      <DateField
        name="testDateFieldWithHydrationValue"
        label="test-date-field-with-hydration-value"
        hydrate={mockHydrationValue}
        clear
      />
    );

    const clearPropGivenAndFalseDateField = (
      <DateField
        name="testDateFieldWithHydrationValue"
        label="test-date-field-with-hydration-value"
        hydrate={mockHydrationValue}
        clear={false}
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

    test("should set value to default if given clear prop and clear is set to true", () => {
      mockGetValues(undefined);

      const result = render(clearPropGivenAndTrueDateField);
      const dateField: HTMLInputElement = result.container.querySelector(
        "[name='testDateFieldWithHydrationValue']"
      )!;
      const displayValue = dateField.value;
      expect(displayValue).toEqual("");
    });

    test("should set value to hydrationvalue if given clear prop and clear is set to false", () => {
      mockGetValues(undefined);
      const result = render(clearPropGivenAndFalseDateField);
      const dateField: HTMLInputElement = result.container.querySelector(
        "[name='testDateFieldWithHydrationValue']"
      )!;
      const displayValue = dateField.value;
      expect(displayValue).toEqual(mockHydrationValue);
    });
  });

  describe("Test DateField autosave functionality", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("Autosaves entered date when state user, autosave true, and field is valid", async () => {
      mockTrigger.mockReturnValue(true);
      mockGetValues(undefined);
      render(dateFieldAutosavingComponent);
      const dateField = screen.getByRole("textbox", {
        name: "test-date-field",
      });
      expect(dateField).toBeVisible();
      await act(async () => {
        await userEvent.type(dateField, "07/14/2022");
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
          fieldData: { testDateField: "07/14/2022" },
        }
      );
    });

    test("Does not autosave if autosave is false", async () => {
      mockGetValues(undefined);
      render(dateFieldComponent);
      const dateField = screen.getByRole("textbox", {
        name: "test-date-field",
      });
      expect(dateField).toBeVisible();
      await act(async () => {
        await userEvent.type(dateField, "07/14/2022");
        await userEvent.tab();
      });
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(0);
    });
  });

  describe("Datefield handles triggering validation", () => {
    const dateFieldComponentWithValidateOnRender = (
      <DateField
        name="testDateField"
        label="test-date-field"
        validateOnRender
      />
    );

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Blanking field triggers form validation", async () => {
      mockGetValues(undefined);
      const result = render(dateFieldComponent);
      expect(mockTrigger).not.toHaveBeenCalled();
      const dateFieldInput = result.getByRole("textbox", {
        name: "test-date-field",
      });
      await act(async () => {
        await userEvent.click(dateFieldInput);
        await userEvent.clear(dateFieldInput);
        await userEvent.tab();
      });
      expect(mockTrigger).toHaveBeenCalled();
    });

    test("Component with validateOnRender passed should validate on initial render", async () => {
      mockGetValues(undefined);
      render(dateFieldComponentWithValidateOnRender);
      expect(mockTrigger).toHaveBeenCalled();
    });
  });

  describe("Test DateField warning functionality", () => {
    test("warning message is not displayed when useFieldWarning returns null", () => {
      mockGetValues(undefined);
      mockUseFieldWarning.mockReturnValue(null);
      render(dateFieldComponent);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    test("warning message is displayed when useFieldWarning returns a message", () => {
      mockGetValues(undefined);
      mockUseFieldWarning.mockReturnValue("Test warning message");
      render(dateFieldComponent);
      expect(screen.getByRole("alert")).toBeVisible();
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Test warning message"
      );
    });

    test("warning message is not displayed when field has an error", () => {
      mockUseFieldWarning.mockReturnValue("Test warning message");
      mockUseFormContext.mockImplementation((): any => ({
        ...mockRhfMethods,
        getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue(undefined),
        formState: {
          errors: {
            testDateField: { message: "This field is required" },
          },
        },
      }));
      render(dateFieldComponent);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByText("This field is required")).toBeVisible();
    });

    test("warning message is not displayed when field is disabled", () => {
      mockGetValues(undefined);
      mockUseFieldWarning.mockReturnValue("Test warning message");
      render(
        <ReportContext.Provider value={mockMcparReportContext}>
          <DateField name="testDateField" label="test-date-field" disabled />
        </ReportContext.Provider>
      );
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  testA11yAct(dateFieldComponent, () => {
    mockGetValues(undefined);
  });
});
