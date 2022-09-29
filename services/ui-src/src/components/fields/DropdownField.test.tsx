import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { useFormContext } from "react-hook-form";
//components
import { DropdownField, ReportContext } from "components";
import { dropdownDefaultOptionText } from "../../constants";
// utils
import {
  mockReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
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

const dropdownComponentWithOptions = (
  <DropdownField
    name="testDropdown"
    label="test-label"
    data-testid="test-dropdown-field"
    options={[
      { label: dropdownDefaultOptionText, value: "" },
      { label: "Option 1", value: "a" },
      { label: "Option 2", value: "b" },
      { label: "Option 3", value: "c" },
    ]}
  />
);

const dropdownComponentWithDynamicOptions = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <DropdownField
        name="testDropdown"
        label="test-label"
        data-testid="test-dropdown-field"
        options={"plans"}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test DropdownField basic functionality", () => {
  test("Dropdown renders", () => {
    render(dropdownComponentWithOptions);
    const dropdown = screen.getByTestId("test-dropdown-field");
    expect(dropdown).toBeVisible();
  });

  test("DropdownField calls onChange function successfully", async () => {
    /*
     * note: because the component is not being rendered via the
     * formFieldFactory, the default initial option is not being added.
     * this test is written accordingly.
     */
    render(dropdownComponentWithOptions);
    const dropdown = screen.getByTestId("test-dropdown-field");
    const option0 = dropdown.children.item(0) as HTMLOptionElement;
    const option2 = dropdown.children.item(2) as HTMLOptionElement;
    expect(option0.selected).toBe(true);
    await userEvent.selectOptions(dropdown, "b");
    expect(option2.selected).toBe(true);
  });
});

describe("Test DropdownField dynamic options functionality", () => {
  test("Dropdown renders dynamic options", () => {
    render(dropdownComponentWithDynamicOptions);
    const dropdown = screen.getByTestId("test-dropdown-field");
    expect(dropdown.children.length).toEqual(3);
  });
});

describe("Test DropdownField hydration functionality", () => {
  const mockFormFieldValue = "a";
  const mockHydrationValue = "c";
  const dropdownComponentWithHydrationValue = (
    <DropdownField
      name="testDropdown"
      label="test label"
      data-testid="test-dropdown-field-to-hydrate"
      hydrate={mockHydrationValue}
      options={[
        { label: "Option 1", value: "a" },
        { label: "Option 2", value: "b" },
        { label: "Option 3", value: "c" },
      ]}
    />
  );

  test("If only formFieldValue exists, displayValue is set to it", () => {
    mockGetValues(mockFormFieldValue);
    render(dropdownComponentWithOptions);
    const dropdownField: HTMLSelectElement = screen.getByTestId(
      "test-dropdown-field"
    );
    const displayValue = dropdownField.value;
    expect(displayValue).toEqual(mockFormFieldValue);
  });

  test("If only hydrationValue exists, displayValue is set to it", () => {
    mockGetValues(undefined);
    render(dropdownComponentWithHydrationValue);
    const dropdownField: HTMLSelectElement = screen.getByTestId(
      "test-dropdown-field-to-hydrate"
    );
    const displayValue = dropdownField.value;
    expect(displayValue).toEqual(mockHydrationValue);
  });

  test("If both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
    mockGetValues(mockFormFieldValue);
    render(dropdownComponentWithHydrationValue);
    const dropdownField: HTMLSelectElement = screen.getByTestId(
      "test-dropdown-field-to-hydrate"
    );
    const displayValue = dropdownField.value;
    expect(displayValue).toEqual(mockFormFieldValue);
  });
});

describe("Test DropdownField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dropdownComponentWithOptions);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
