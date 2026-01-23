import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
// components
import { MonthYearField, ReportContext } from "components";
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

const monthYearFieldComponent = (
  <MonthYearField
    name="testMonthYearField"
    label="test-label"
    placeholder="test-placeholder"
  />
);

const monthYearFieldAutosavingComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <MonthYearField
      name="testMonthYearField"
      label="test-label"
      placeholder="test-placeholder"
      autosave
    />
  </ReportContext.Provider>
);

describe("<MonthYearField />", () => {
  describe("Test MonthYearField component", () => {
    test("MonthYearField is visible", () => {
      mockGetValues("");
      render(monthYearFieldComponent);
      const monthYearField = screen.getByText("test-label");
      expect(monthYearField).toBeVisible();
      jest.clearAllMocks();
    });
  });

  describe("Test MonthYearField hydration functionality", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    const mockFormFieldValue = "mock-form-field-value";
    const mockHydrationValue = "05/2025";
    const monthYearFieldComponentWithHydrationValue = (
      <MonthYearField
        name="testMonthYearFieldWithHydrationValue"
        label="test-label"
        placeholder="test-placeholder"
        hydrate={mockHydrationValue}
      />
    );

    const clearPropGivenAndTrueMonthYearField = (
      <MonthYearField
        name="testMonthYearFieldWithHydrationValue"
        label="test-label"
        placeholder="test-placeholder"
        hydrate={mockHydrationValue}
        clear
      />
    );

    const clearPropGivenAndFalseMonthYearField = (
      <MonthYearField
        name="testMonthYearFieldWithHydrationValue"
        label="test-label"
        placeholder="test-placeholder"
        hydrate={mockHydrationValue}
        clear={false}
      />
    );

    test("If only formFieldValue exists, displayValue is set to it", () => {
      mockGetValues(mockFormFieldValue);
      const result = render(monthYearFieldComponent);
      const monthYearField: HTMLInputElement = result.container.querySelector(
        "[name='testMonthYearField']"
      )!;
      const displayValue = monthYearField.value;
      expect(displayValue).toEqual(mockFormFieldValue);
    });

    test("If only hydrationValue exists, displayValue is set to it", () => {
      mockGetValues(undefined);
      const result = render(monthYearFieldComponentWithHydrationValue);
      const monthYearField: HTMLInputElement = result.container.querySelector(
        "[name='testMonthYearFieldWithHydrationValue']"
      )!;
      const displayValue = monthYearField.value;
      expect(displayValue).toEqual(mockHydrationValue);
    });

    test("If both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
      mockGetValues(mockFormFieldValue);
      const result = render(monthYearFieldComponentWithHydrationValue);
      const monthYearField: HTMLInputElement = result.container.querySelector(
        "[name='testMonthYearFieldWithHydrationValue']"
      )!;
      const displayValue = monthYearField.value;
      expect(displayValue).toEqual(mockFormFieldValue);
    });

    test("should set value to default if given clear prop and clear is set to true", () => {
      mockGetValues(undefined);

      const result = render(clearPropGivenAndTrueMonthYearField);
      const monthYearField: HTMLInputElement = result.container.querySelector(
        "[name='testMonthYearFieldWithHydrationValue']"
      )!;
      const displayValue = monthYearField.value;
      expect(displayValue).toEqual("");
    });

    test("should set value to hydrationvalue if given clear prop and clear is set to false", () => {
      mockGetValues(undefined);
      const result = render(clearPropGivenAndFalseMonthYearField);
      const monthYearField: HTMLInputElement = result.container.querySelector(
        "[name='testMonthYearFieldWithHydrationValue']"
      )!;
      const displayValue = monthYearField.value;
      expect(displayValue).toEqual(mockHydrationValue);
    });
  });

  describe("Test MonthYearField component autosaves", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("MonthYearField autosaves with typed value when stateuser, autosave true, and form is valid", async () => {
      mockTrigger.mockReturnValue(true);
      mockGetValues(undefined);
      render(monthYearFieldAutosavingComponent);
      const monthYearField = screen.getByRole("textbox", {
        name: "test-label",
      });
      expect(monthYearField).toBeVisible();
      await act(async () => {
        await userEvent.type(monthYearField, "01/2021");
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
          fieldData: { testMonthYearField: "01/2021" },
        }
      );
    });

    test("MonthYearField autosaves with default value when stateuser, autosave true, and form invalid", async () => {
      mockTrigger.mockReturnValue(false);
      mockGetValues(undefined);
      render(monthYearFieldAutosavingComponent);
      const monthYearField = screen.getByRole("textbox", {
        name: "test-label",
      });
      expect(monthYearField).toBeVisible();
      await act(async () => {
        await userEvent.type(monthYearField, "02/2022");
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
          fieldData: { testMonthYearField: "" },
        }
      );
    });

    test("MonthYearField does not autosave when not autosave not set to true", async () => {
      mockGetValues(undefined);
      render(monthYearFieldComponent);
      const monthYearField = screen.getByRole("textbox", {
        name: "test-label",
      });
      expect(monthYearField).toBeVisible();
      await act(async () => {
        await userEvent.type(monthYearField, "03/2023");
        await userEvent.tab();
      });
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(0);
    });
  });

  describe("MonthYearField handles triggering validation", () => {
    const monthYearFieldValidateOnRenderComponent = (
      <MonthYearField
        name="testMonthYearField"
        label="test-label"
        placeholder="test-placeholder"
        validateOnRender
      />
    );

    afterEach(() => {
      jest.clearAllMocks();
    });
    test("Blanking field triggers form validation", async () => {
      mockGetValues(undefined);
      render(monthYearFieldComponent);
      expect(mockTrigger).not.toHaveBeenCalled();
      const monthYearField = screen.getByRole("textbox", {
        name: "test-label",
      });
      expect(monthYearField).toBeVisible();
      await act(async () => {
        await userEvent.clear(monthYearField);
        await userEvent.tab();
      });
      expect(mockTrigger).toHaveBeenCalled();
    });

    test("Component with validateOnRender passed should validate on initial render", async () => {
      mockGetValues(undefined);
      render(monthYearFieldValidateOnRenderComponent);
      expect(mockTrigger).toHaveBeenCalled();
    });
  });

  testA11yAct(monthYearFieldComponent, () => {
    mockGetValues(undefined);
  });
});
