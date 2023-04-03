import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { useFormContext } from "react-hook-form";
//components
import { DropdownField, ReportContext } from "components";
import { dropdownDefaultOptionText } from "../../constants";
// utils
import {
  mockMcparReportContext,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useUser } from "utils";
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

const dropdownComponentWithOptions = (
  <DropdownField
    name="testDropdown"
    label="test-dropdown-label"
    options={[
      { label: dropdownDefaultOptionText, value: "" },
      { label: "Option 1", value: "a" },
      { label: "Option 2", value: "b" },
      { label: "Option 3", value: "c" },
    ]}
  />
);

const dropdownComponentWithOptionsAndAutosave = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <DropdownField
        name="testDropdown"
        label="test-dropdown-label"
        options={[
          { label: dropdownDefaultOptionText, value: "" },
          { label: "Option 1", value: "a" },
          { label: "Option 2", value: "b" },
          { label: "Option 3", value: "c" },
        ]}
        autosave
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const dropdownComponentWithDynamicOptions = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <DropdownField
        name="testDropdown"
        label="test-dropdown-label"
        options={"plans"}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test DropdownField basic functionality", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
  });

  test("Dropdown renders", () => {
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
    await userEvent.selectOptions(dropdown, "b");
    expect(option2.selected).toBe(true);
  });
});

describe("Test DropdownField dynamic options functionality", () => {
  test("Dropdown renders dynamic options", () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(dropdownComponentWithDynamicOptions);
    const dropdown = screen.getByLabelText("test-dropdown-label");
    expect(dropdown.children.length).toEqual(3);
  });
});

describe("Test DropdownField hydration functionality", () => {
  const mockFormFieldValue = { label: "Option 1", value: "a" };
  const mockHydrationValue = { label: "Option 3", value: "c" };
  const dropdownComponentWithHydrationValue = (
    <DropdownField
      name="testDropdown"
      label="test-dropdown-field-to-hydrate"
      data-testid="test-dropdown-field-to-hydrate"
      hydrate={mockHydrationValue}
      options={[
        { label: "Option 1", value: "a" },
        { label: "Option 2", value: "b" },
        { label: "Option 3", value: "c" },
      ]}
    />
  );

  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
  });

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
    mockedUseUser.mockReturnValue(mockStateUser);
    mockTrigger.mockReturnValue(true);
    mockGetValues(undefined);
    render(dropdownComponentWithOptionsAndAutosave);
    const dropDown = screen.getByLabelText("test-dropdown-label");
    expect(dropDown).toBeVisible();
    const option2 = dropDown.children.item(2) as HTMLOptionElement;
    await userEvent.selectOptions(dropDown, "b");
    expect(option2.selected).toBe(true);
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
        fieldData: { testDropdown: { label: "testDropdown", value: "b" } },
      }
    );
  });

  test("Autosaves default value when stateuser, autosave true, and field invalid", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockTrigger.mockReturnValue(false);
    mockGetValues(undefined);
    render(dropdownComponentWithOptionsAndAutosave);
    const dropDown = screen.getByLabelText("test-dropdown-label");
    expect(dropDown).toBeVisible();
    const option2 = dropDown.children.item(2) as HTMLOptionElement;
    await userEvent.selectOptions(dropDown, "b");
    expect(option2.selected).toBe(true);
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
        fieldData: {
          testDropdown: { label: "- Select an option -", value: "" },
        },
      }
    );
  });

  test("Does not autosave if autosave is false", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockGetValues(undefined);
    render(dropdownComponentWithOptions);
    const dropDown = screen.getByLabelText("test-dropdown-label");
    expect(dropDown).toBeVisible();
    const option2 = dropDown.children.item(2) as HTMLOptionElement;
    await userEvent.selectOptions(dropDown, "b");
    expect(option2.selected).toBe(true);
    await userEvent.tab();
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(0);
  });
});

describe("Test DropdownField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dropdownComponentWithOptions);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
