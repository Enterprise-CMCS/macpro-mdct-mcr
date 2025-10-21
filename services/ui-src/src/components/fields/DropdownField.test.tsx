import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
// components
import { DropdownField, ReportContext } from "components";
// types
import { ReportStatus } from "types";
// utils
import {
  mockDropdownOptions,
  mockMcparReportContext,
  mockMcparReportStore,
  mockStateUserStore,
  RouterWrappedComponent,
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

const dropdownComponentWithOptions = (
  <DropdownField
    name="testDropdown"
    label="test-dropdown-label"
    options={mockDropdownOptions}
  />
);

const dropdownComponentWithOptionsAndAutosave = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <DropdownField
        name="testDropdown"
        label="test-dropdown-label"
        options={mockDropdownOptions}
        autosave
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const dropdownComponentWithDynamicOptions = (
  <RouterWrappedComponent>
    <DropdownField
      name="testDropdown"
      label="test-dropdown-label"
      options="plans"
    />
  </RouterWrappedComponent>
);

const dropdownComponentWithYoYCopy = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <DropdownField
        name="testDropdown"
        label="test-dropdown-label"
        options="copyEligibleReports"
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const dropdownComponentWithYoYCopyNoSubmittedReports = (
  <RouterWrappedComponent>
    <DropdownField
      name="testDropdown"
      label="test-dropdown-label"
      options="copyEligibleReports"
    />
  </RouterWrappedComponent>
);

describe("<DropdownField />", () => {
  describe("Test DropdownField basic functionality", () => {
    test("Dropdown renders", () => {
      mockGetValues(undefined);
      render(dropdownComponentWithOptions);
      const dropdown = screen.getByLabelText("test-dropdown-label");
      expect(dropdown).toBeVisible();
    });

    test("DropdownField calls onChange function successfully", async () => {
      /*
       * note: because the component is not being rendered via the
       * formFieldFactory, the default initial option is not being added.
       * this test is written accordingly.
       */
      render(dropdownComponentWithOptions);
      const dropdown = screen.getByLabelText("test-dropdown-label");
      const option0 = dropdown.children.item(0) as HTMLOptionElement;
      const option2 = dropdown.children.item(2) as HTMLOptionElement;
      expect(option0.selected).toBe(true);
      await act(async () => {
        await userEvent.selectOptions(dropdown, "test-dropdown-2");
      });
      expect(option2.selected).toBe(true);
    });
  });

  describe("Test DropdownField dynamic options functionality", () => {
    test("Dropdown renders dynamic options", () => {
      mockGetValues(undefined);
      render(dropdownComponentWithDynamicOptions);
      const dropdown = screen.getByLabelText("test-dropdown-label");
      expect(dropdown.children.length).toEqual(3);
    });
  });

  describe("Test DropdownField hydration functionality", () => {
    const mockFormFieldValue = { label: "Option 1", value: "test-dropdown-1" };
    const mockHydrationValue = { label: "Option 3", value: "test-dropdown-3" };
    const dropdownComponentWithHydrationValue = (
      <DropdownField
        name="testDropdown"
        label="test-dropdown-field-to-hydrate"
        hydrate={mockHydrationValue}
        options={mockDropdownOptions}
      />
    );

    test("If only formFieldValue exists, displayValue is set to it", () => {
      mockGetValues(mockFormFieldValue);
      render(dropdownComponentWithOptions);
      const dropdownField: HTMLSelectElement = screen.getByLabelText(
        "test-dropdown-label"
      );
      const displayValue = dropdownField.value;
      expect(displayValue).toEqual(mockFormFieldValue.value);
    });

    test("If only hydrationValue exists, displayValue is set to it", () => {
      mockGetValues(undefined);
      render(dropdownComponentWithHydrationValue);
      const dropdownField: HTMLSelectElement = screen.getByLabelText(
        "test-dropdown-field-to-hydrate"
      );
      const displayValue = dropdownField.value;
      expect(displayValue).toEqual(mockHydrationValue.value);
    });

    test("If both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
      mockGetValues(mockFormFieldValue);
      render(dropdownComponentWithHydrationValue);
      const dropdownField: HTMLSelectElement = screen.getByLabelText(
        "test-dropdown-field-to-hydrate"
      );
      const displayValue = dropdownField.value;
      expect(displayValue).toEqual(mockFormFieldValue.value);
    });
  });

  describe("Test DropdownField autosaves", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("Autosaves selected value when stateuser, autosave true, and field is valid", async () => {
      mockTrigger.mockReturnValue(true);
      mockGetValues(undefined);
      render(dropdownComponentWithOptionsAndAutosave);
      const dropDown = screen.getByLabelText("test-dropdown-label");
      expect(dropDown).toBeVisible();
      const option2 = dropDown.children.item(2) as HTMLOptionElement;
      await act(async () => {
        await userEvent.selectOptions(dropDown, "test-dropdown-2");
        expect(option2.selected).toBe(true);
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
          fieldData: {
            testDropdown: { label: "testDropdown", value: "test-dropdown-2" },
          },
        }
      );
    });

    test("Autosaves default value when stateuser, autosave true, and field invalid", async () => {
      mockTrigger.mockReturnValue(false);
      mockGetValues(undefined);
      render(dropdownComponentWithOptionsAndAutosave);
      const dropDown = screen.getByLabelText("test-dropdown-label");
      expect(dropDown).toBeVisible();
      const option2 = dropDown.children.item(2) as HTMLOptionElement;
      await act(async () => {
        await userEvent.selectOptions(dropDown, "test-dropdown-2");
        expect(option2.selected).toBe(true);
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
          fieldData: {
            testDropdown: { label: "- Select an option -", value: "" },
          },
        }
      );
    });

    test("Does not autosave if autosave is false", async () => {
      mockGetValues(undefined);
      render(dropdownComponentWithOptions);
      const dropDown = screen.getByLabelText("test-dropdown-label");
      expect(dropDown).toBeVisible();
      const option2 = dropDown.children.item(2) as HTMLOptionElement;
      await act(async () => {
        await userEvent.selectOptions(dropDown, "test-dropdown-2");
        expect(option2.selected).toBe(true);
        await userEvent.tab();
      });
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(0);
    });
  });

  describe("Dropdown handles triggering validation", () => {
    const dropdownComponentWithOptionsAndValidateOnRender = (
      <DropdownField
        name="testDropdown"
        label="test-dropdown-label"
        options={mockDropdownOptions}
        validateOnRender
      />
    );

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Component with validateOnRender passed should validate on render", () => {
      mockGetValues(undefined);
      render(dropdownComponentWithOptionsAndValidateOnRender);
      const dropdown = screen.getByLabelText("test-dropdown-label");
      expect(dropdown.children.length).toEqual(4);
      expect(mockTrigger).toHaveBeenCalled();
    });
  });

  describe("Test YoY Copy options dropdown menu", () => {
    test("Populates with reports", () => {
      mockGetValues(undefined);
      render(dropdownComponentWithYoYCopy);
      const dropdown = screen.getByLabelText("test-dropdown-label");
      expect(dropdown.children.length).toEqual(
        mockMcparReportContext.copyEligibleReportsByState.length + 1
      );
    });
  });

  describe("If there are no submitted reports to copy, dropdown default value should say 'No reports eligible for copy'", () => {
    test("Populates with reports", () => {
      mockGetValues(undefined);
      const mockNoCopyEligibleStore = {
        ...mockMcparReportStore,
        copyEligibleReportsByState: [],
      };
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNoCopyEligibleStore,
      });
      render(dropdownComponentWithYoYCopyNoSubmittedReports);
      const dropdown = screen.getByLabelText("test-dropdown-label");
      expect(dropdown.children[0].textContent).toEqual(
        "No reports eligible for copy"
      );
    });
  });

  testA11yAct(dropdownComponentWithOptions, () => {
    mockGetValues(undefined);
  });
});
