import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
// components
import { ReportContext, TextField } from "components";
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

const textFieldComponent = (
  <TextField
    name="testTextField"
    label="test-label"
    placeholder="test-placeholder"
  />
);

const textFieldAutosavingComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <TextField
      name="testTextField"
      label="test-label"
      placeholder="test-placeholder"
      autosave
    />
  </ReportContext.Provider>
);

describe("<TextField />", () => {
  describe("Test TextField component", () => {
    test("TextField is visible", () => {
      mockGetValues("");
      render(textFieldComponent);
      const textField = screen.getByText("test-label");
      expect(textField).toBeVisible();
      jest.clearAllMocks();
    });
  });

  describe("Test TextField hydration functionality", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    const mockFormFieldValue = "mock-form-field-value";
    const mockHydrationValue = "mock-hydration-value";
    const textFieldComponentWithHydrationValue = (
      <TextField
        name="testTextFieldWithHydrationValue"
        label="test-label"
        placeholder="test-placeholder"
        hydrate={mockHydrationValue}
      />
    );

    const clearPropGivenAndTrueTextField = (
      <TextField
        name="testTextFieldWithHydrationValue"
        label="test-label"
        placeholder="test-placeholder"
        hydrate={mockHydrationValue}
        clear
      />
    );

    const clearPropGivenAndFalseTextField = (
      <TextField
        name="testTextFieldWithHydrationValue"
        label="test-label"
        placeholder="test-placeholder"
        hydrate={mockHydrationValue}
        clear={false}
      />
    );

    test("If only formFieldValue exists, displayValue is set to it", () => {
      mockGetValues(mockFormFieldValue);
      const result = render(textFieldComponent);
      const textField: HTMLInputElement = result.container.querySelector(
        "[name='testTextField']"
      )!;
      const displayValue = textField.value;
      expect(displayValue).toEqual(mockFormFieldValue);
    });

    test("If only hydrationValue exists, displayValue is set to it", () => {
      mockGetValues(undefined);
      const result = render(textFieldComponentWithHydrationValue);
      const textField: HTMLInputElement = result.container.querySelector(
        "[name='testTextFieldWithHydrationValue']"
      )!;
      const displayValue = textField.value;
      expect(displayValue).toEqual(mockHydrationValue);
    });

    test("If both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
      mockGetValues(mockFormFieldValue);
      const result = render(textFieldComponentWithHydrationValue);
      const textField: HTMLInputElement = result.container.querySelector(
        "[name='testTextFieldWithHydrationValue']"
      )!;
      const displayValue = textField.value;
      expect(displayValue).toEqual(mockFormFieldValue);
    });

    test("should set value to default if given clear prop and clear is set to true", () => {
      mockGetValues(undefined);

      const result = render(clearPropGivenAndTrueTextField);
      const textField: HTMLInputElement = result.container.querySelector(
        "[name='testTextFieldWithHydrationValue']"
      )!;
      const displayValue = textField.value;
      expect(displayValue).toEqual("");
    });

    test("should set value to hydrationvalue if given clear prop and clear is set to false", () => {
      mockGetValues(undefined);
      const result = render(clearPropGivenAndFalseTextField);
      const textField: HTMLInputElement = result.container.querySelector(
        "[name='testTextFieldWithHydrationValue']"
      )!;
      const displayValue = textField.value;
      expect(displayValue).toEqual(mockHydrationValue);
    });
  });

  describe("Test TextField component autosaves", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("TextField autosaves with typed value when stateuser, autosave true, and form is valid", async () => {
      mockTrigger.mockReturnValue(true);
      mockGetValues(undefined);
      render(textFieldAutosavingComponent);
      const textField = screen.getByRole("textbox", {
        name: "test-label",
      });
      expect(textField).toBeVisible();
      await act(async () => {
        await userEvent.type(textField, "test value");
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
          fieldData: { testTextField: "test value" },
        }
      );
    });

    test("TextField autosaves with default value when stateuser, autosave true, and form invalid", async () => {
      mockTrigger.mockReturnValue(false);
      mockGetValues(undefined);
      render(textFieldAutosavingComponent);
      const textField = screen.getByRole("textbox", {
        name: "test-label",
      });
      expect(textField).toBeVisible();
      await act(async () => {
        await userEvent.type(textField, "test value");
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
          fieldData: { testTextField: "" },
        }
      );
    });

    test("TextField does not autosave when not autosave not set to true", async () => {
      mockGetValues(undefined);
      render(textFieldComponent);
      const textField = screen.getByRole("textbox", {
        name: "test-label",
      });
      expect(textField).toBeVisible();
      await act(async () => {
        await userEvent.type(textField, "test value");
        await userEvent.tab();
      });
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(0);
    });
  });

  describe("Textfield handles triggering validation", () => {
    const textFieldValidateOnRenderComponent = (
      <TextField
        name="testTextField"
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
      render(textFieldComponent);
      expect(mockTrigger).not.toHaveBeenCalled();
      const textField = screen.getByRole("textbox", {
        name: "test-label",
      });
      expect(textField).toBeVisible();
      await act(async () => {
        await userEvent.clear(textField);
        await userEvent.tab();
      });
      expect(mockTrigger).toHaveBeenCalled();
    });

    test("Component with validateOnRender passed should validate on initial render", async () => {
      mockGetValues(undefined);
      render(textFieldValidateOnRenderComponent);
      expect(mockTrigger).toHaveBeenCalled();
    });
  });

  testA11yAct(textFieldComponent, () => {
    mockGetValues(undefined);
  });
});
