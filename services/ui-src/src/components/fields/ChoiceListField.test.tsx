import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { useFormContext } from "react-hook-form";
import { ChoiceListField, ReportContext } from "components";
import { mockMcparReportContext } from "utils/testing/setupJest";
import { Choice, ReportStatus } from "types";
import { getNestedChildFieldsOfUncheckedParent } from "./ChoiceListField";

//
const mockTrigger = jest.fn().mockReturnValue(true);
const mockSetValue = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: mockSetValue,
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

const mockChoices = [
  {
    id: "Choice 1",
    name: "Choice 1",
    label: "Choice 1",
    value: "Choice 1",
    checked: false,
  },
  {
    id: "Choice 2",
    name: "Choice 2",
    label: "Choice 2",
    value: "Choice 2",
    checked: false,
  },
];

const mockNestedChoices = [
  {
    id: "Choice 4",
    name: "Choice 4",
    label: "Choice 4",
    value: "Choice 4",
    checked: false,
  },
  {
    id: "Choice 5",
    name: "Choice 5",
    label: "Choice 5",
    value: "Choice 5",
    checked: false,
  },
];

const mockNestedCheckboxChoices = [
  {
    id: "Choice 6",
    name: "Choice 6",
    label: "Choice 6",
    value: "Choice 6",
    checked: false,
  },
  {
    id: "Choice 7",
    name: "Choice 7",
    label: "Choice 7",
    value: "Choice 7",
    checked: false,
  },
];

const mockDropdownOptions = [
  {
    label: "Option 1",
    value: "test-dropdown-1",
  },
  {
    label: "Option 2",
    value: "test-dropdown-2",
  },
];

const mockNestedChildren = [
  {
    id: "Choice 3-otherText",
    name: "Choice 3-otherText",
    type: "text",
  },
  {
    id: "test-nested-child-radio",
    type: "radio",
    props: {
      choices: [...mockNestedChoices],
    },
  },
  {
    id: "test-nested-child-checkbox",
    type: "checkbox",
    props: {
      choices: [...mockNestedCheckboxChoices],
    },
  },
  {
    id: "test-nest-child-dropdown",
    type: "dropdown",
    props: {
      options: [...mockDropdownOptions],
    },
  },
];

const mockChoiceWithChild = {
  id: "Choice 3",
  name: "Choice 3",
  label: "Choice 3",
  value: "Choice 3",
  checked: false,
  children: mockNestedChildren,
};

const CheckboxComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ChoiceListField
      choices={mockChoices}
      label="Checkbox example"
      name="checkboxField"
      type="checkbox"
    />
  </ReportContext.Provider>
);

const CheckboxComponentWithNestedChildren = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ChoiceListField
      choices={[...mockChoices, mockChoiceWithChild]}
      label="Radio example"
      name="checkboxFieldWithNestedChildren"
      type="checkbox"
    />
  </ReportContext.Provider>
);

const RadioComponentWithNestedChildren = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ChoiceListField
      choices={[...mockChoices, mockChoiceWithChild]}
      label="Radio example"
      name="radioFieldWithNestedChildren"
      type="radio"
    />
  </ReportContext.Provider>
);

const RadioComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ChoiceListField
      choices={mockChoices}
      label="Radio example"
      name="radioField"
      type="radio"
    />
  </ReportContext.Provider>
);

describe("Test ChoiceListField component rendering", () => {
  it("ChoiceList should render a normal Radiofield that doesn't have children", () => {
    render(RadioComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByText("Choice 2")).toBeVisible();
  });

  it("ChoiceList should render a normal Checkbox that doesn't have children", () => {
    render(CheckboxComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByText("Choice 2")).toBeVisible();
  });

  it("RadioField should render nested child fields for choices with children", () => {
    // Render Initial State and choices
    render(RadioComponentWithNestedChildren);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByText("Choice 2")).toBeVisible();
    expect(screen.getByText("Choice 3")).toBeVisible();

    // Choice 3 has 2 children underneath it, we can get them to show by chosing that choice
    const thirdRadioOption = screen.getByLabelText("Choice 3");
    fireEvent.click(thirdRadioOption);
    expect(screen.getByText("Choice 4")).toBeVisible();
    expect(screen.getByText("Choice 5")).toBeVisible();
  });

  it("CheckboxField should render nested child fields for choices with children", async () => {
    // Render Initial State and choices
    render(CheckboxComponentWithNestedChildren);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByText("Choice 2")).toBeVisible();
    expect(screen.getByText("Choice 3")).toBeVisible();

    // Choice 3 has 2 children underneath it, we can get them to show by chosing that choice
    const thirdCheckbox = screen.getByLabelText("Choice 3");
    fireEvent.click(thirdCheckbox);
    expect(screen.getByText("Choice 4")).toBeVisible();
    expect(screen.getByText("Choice 5")).toBeVisible();
  });
});

describe("Test Choicelist Hydration", () => {
  const CheckboxHydrationComponent = (
    <ReportContext.Provider value={mockMcparReportContext}>
      <ChoiceListField
        choices={mockChoices}
        label="Checkbox Hydration Example"
        name="checkboxHydrationField"
        type="checkbox"
        hydrate={[{ key: "Choice 1", value: "Choice 1" }]}
        autosave
      />
    </ReportContext.Provider>
  );

  const RadioHydrationComponent = (
    <ReportContext.Provider value={mockMcparReportContext}>
      <ChoiceListField
        choices={mockChoices}
        label="Radio Hydration Example"
        name="radioHydrationField"
        type="radio"
        hydrate={[{ key: "Choice 1", value: "Choice 1" }]}
        autosave
      />
    </ReportContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Checkbox Choicelist correctly setting passed hydration value", () => {
    /*
     * Set the mock of form.GetValues to return nothing to represent that a user hasn't made any updates
     * and the form should be updated based purely on the hydration values
     */
    mockGetValues(undefined);

    // Create the Checkbox Component
    const wrapper = render(CheckboxHydrationComponent);

    const firstCheckbox = wrapper.getByRole("checkbox", { name: "Choice 1" });
    const secondCheckbox = wrapper.getByRole("checkbox", { name: "Choice 2" });

    // Confirm hydration successfully made the first value checked
    expect(firstCheckbox).toBeChecked();
    expect(secondCheckbox).not.toBeChecked();
  });

  test("Checkbox Choicelist correctly setting passed field value even when given a different hydration value", () => {
    /*
     * Set the mock of form.GetValues to return a users choice of the first checkbox being checked
     * so that even though hydration is passed as having Choice 1 as checked, the users input is respected instead
     */
    mockGetValues([{ key: "Choice 2", value: "Choice 2" }]);

    // Create the Checkbox Component
    const wrapper = render(CheckboxHydrationComponent);
    const firstCheckbox = wrapper.getByRole("checkbox", { name: "Choice 1" });
    const secondCheckbox = wrapper.getByRole("checkbox", { name: "Choice 2" });

    // Confirm hydration successfully made the first value checked
    expect(firstCheckbox).not.toBeChecked();
    expect(secondCheckbox).toBeChecked();
  });

  // Repeat above tests for RadioField to ensure nothing changes
  test("Radio Choicelist correctly setting passed hydration value", () => {
    /*
     * Set the mock of form.GetValues to return nothing to represent that a user hasn't made any updates
     * and the form should be updated based purely on the hydration values
     */
    mockGetValues(undefined);

    // Create the Radio Component
    const wrapper = render(RadioHydrationComponent);

    const firstRadioOption = wrapper.getByRole("radio", { name: "Choice 1" });
    const secondRadioOption = wrapper.getByRole("radio", { name: "Choice 2" });

    // Confirm hydration successfully made the first value checked
    expect(firstRadioOption).toBeChecked();
    expect(secondRadioOption).not.toBeChecked();
  });

  test("Radio Choicelist correctly setting passed field value even when given a different hydration value", () => {
    /*
     * Set the mock of form.GetValues to return a users choice of the first radio being checked
     * so that even though hydration is passed is Choice 1 as checked, the users input is respected instead
     */
    mockGetValues([{ key: "Choice 2", value: "Choice 2" }]);

    // Create the Radio Component
    const wrapper = render(RadioHydrationComponent);
    const firstRadioOption = wrapper.getByRole("radio", { name: "Choice 1" });
    const secondRadioOption = wrapper.getByRole("radio", { name: "Choice 2" });

    // Confirm hydration successfully made the first value checked
    expect(firstRadioOption).not.toBeChecked();
    expect(secondRadioOption).toBeChecked();
  });
});

describe("Test Choicelist Autosaving Methods", () => {
  const CheckboxWithAutosaveEnabledComponent = (
    <ReportContext.Provider value={mockMcparReportContext}>
      <ChoiceListField
        choices={mockChoices}
        label="Autosave Enabled Checkbox Field"
        name="autosaveCheckboxField"
        type="checkbox"
        autosave
      />
    </ReportContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Choicelist Checkbox autosaves with checked value when autosave true, and form is valid", async () => {
    mockGetValues(undefined);

    // Create the Checkbox Component
    const wrapper = render(CheckboxWithAutosaveEnabledComponent);

    const firstCheckbox = wrapper.getByRole("checkbox", { name: "Choice 1" });
    const secondCheckbox = wrapper.getByRole("checkbox", { name: "Choice 2" });

    // Select the first Checkbox and check it
    expect(firstCheckbox).not.toBeChecked();
    expect(secondCheckbox).not.toBeChecked();
    fireEvent.click(firstCheckbox);

    // Confirm the checkboxes are checked correctly
    const checkedCheckboxes = wrapper.getAllByRole("checkbox", {
      checked: true,
    });
    expect(checkedCheckboxes).toHaveLength(1);
    expect(firstCheckbox).toBeChecked();
    expect(secondCheckbox).not.toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(firstCheckbox);

    // Make sure the form value is set to what we've clicked (Which is only Choice 1)
    const firstCheckboxData = [{ key: "Choice 1", value: "Choice 1" }];
    expect(mockSetValue).toHaveBeenCalledWith(
      "autosaveCheckboxField",
      firstCheckboxData,
      {
        shouldValidate: true,
      }
    );

    // Ensure we call autosave with the correct data
    await waitFor(() => {
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);
    });
    await waitFor(() =>
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledWith(
        {
          reportType: mockMcparReportContext.report.reportType,
          id: mockMcparReportContext.report.id,
        },
        {
          metadata: {
            status: ReportStatus.IN_PROGRESS,
          },
          fieldData: {
            autosaveCheckboxField: firstCheckboxData,
          },
        }
      )
    );
  });
});

/*
 * While the onChangeHandler will be called in every other test and therefor doesn't necessarily bear repeating,
 * this test focuses specifically on interaction between whats been checked in the state and whats now been unchecked.
 * This is especially useful for the current interaction in how onChangeHandler sets the value for Checkboxes
 */
describe("Test Choicelist onChangeHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Checking and unchecking choices in a CheckboxChoicelist are reflected correctly in the form", async () => {
    mockGetValues(undefined);

    // Create the Checkbox Component
    const wrapper = render(CheckboxComponent);

    const firstCheckbox = wrapper.getByRole("checkbox", { name: "Choice 1" });
    const secondCheckbox = wrapper.getByRole("checkbox", { name: "Choice 2" });

    // Make sure default state is set correctly
    expect(firstCheckbox).not.toBeChecked();
    expect(secondCheckbox).not.toBeChecked();

    // Select the first Checkbox and check it
    fireEvent.click(firstCheckbox);

    // Confirm the checkboxes are checked correctly
    const checkedCheckboxes = wrapper.getAllByRole("checkbox", {
      checked: true,
    });
    expect(checkedCheckboxes).toHaveLength(1);
    expect(firstCheckbox).toBeChecked();
    expect(secondCheckbox).not.toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(firstCheckbox);

    // Make sure the form value is set to what we've clicked (Which is only Choice 1)
    const firstCheckboxData = [{ key: "Choice 1", value: "Choice 1" }];
    expect(mockSetValue).toHaveBeenCalledWith(
      "checkboxField",
      firstCheckboxData,
      {
        shouldValidate: true,
      }
    );

    // Now uncheck the first checkbox to trigger the onChangeHandler
    fireEvent.click(firstCheckbox);

    // Confirm the checkboxes are checked correctly and reset to the default position
    const uncheckedCheckboxes = wrapper.getAllByRole("checkbox", {
      checked: false,
    });
    expect(uncheckedCheckboxes).toHaveLength(2);
    expect(firstCheckbox).not.toBeChecked();
    expect(secondCheckbox).not.toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(firstCheckbox);

    // Make sure the form value is set to default state
    expect(mockSetValue).toHaveBeenCalledWith(
      "checkboxField",
      firstCheckboxData,
      {
        shouldValidate: true,
      }
    );
  });

  test("Checking and unchecking choices in a RadioChoicelist are reflected correctly in the form", async () => {
    mockGetValues(undefined);

    // Create the Radio Component
    const wrapper = render(RadioComponent);

    const firstRadioOption = wrapper.getByRole("radio", { name: "Choice 1" });
    const secondRadioOption = wrapper.getByRole("radio", { name: "Choice 2" });

    // Make sure default state is set correctly
    expect(firstRadioOption).not.toBeChecked();
    expect(secondRadioOption).not.toBeChecked();

    // Select the first Radio and check it
    fireEvent.click(firstRadioOption);

    // Confirm the radio options are checked correctly
    const checkedOptions = wrapper.getAllByRole("radio", {
      checked: true,
    });
    expect(checkedOptions).toHaveLength(1);
    expect(firstRadioOption).toBeChecked();
    expect(secondRadioOption).not.toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(firstRadioOption);

    // Make sure the form value is set to what we've clicked (Which is only Choice 1)
    const firstRadioOptionOptionData = [{ key: "Choice 1", value: "Choice 1" }];
    expect(mockSetValue).toHaveBeenCalledWith(
      "radioField",
      firstRadioOptionOptionData,
      {
        shouldValidate: true,
      }
    );

    // Now check the second radio option to trigger the onChangeHandler
    fireEvent.click(secondRadioOption);

    // Confirm the radio options are checked correctly
    const uncheckedRadioOptions = wrapper.getAllByRole("radio", {
      checked: false,
    });
    expect(uncheckedRadioOptions).toHaveLength(1);
    expect(firstRadioOption).not.toBeChecked();
    expect(secondRadioOption).toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(firstRadioOption);

    // Make sure the form value is set to default state
    expect(mockSetValue).toHaveBeenCalledWith(
      "radioField",
      firstRadioOptionOptionData,
      {
        shouldValidate: true,
      }
    );
  });

  test("Checking and unchecking choices that have a nested textbox child sets that textbox to its default value", async () => {
    mockGetValues(undefined);

    // Create the Checkbox Component
    const wrapper = render(CheckboxComponentWithNestedChildren);

    const parentCheckbox = wrapper.getByRole("checkbox", { name: "Choice 3" });

    // Make sure default state is set correctly
    expect(parentCheckbox).not.toBeChecked();

    // Select the first Checkbox and check it
    fireEvent.click(parentCheckbox);

    // Confirm the checkbox options are checked correctly
    const checkedOptions = wrapper.getAllByRole("checkbox", {
      checked: true,
    });
    expect(checkedOptions).toHaveLength(1);
    expect(parentCheckbox).toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(parentCheckbox);

    // Make sure the form value is set to what we've clicked (Which is only Choice 3)
    const parentCheckboxData = [{ key: "Choice 3", value: "Choice 3" }];
    expect(mockSetValue).toHaveBeenCalledWith(
      "checkboxFieldWithNestedChildren",
      parentCheckboxData,
      {
        shouldValidate: true,
      }
    );

    const childTextBox: HTMLInputElement = wrapper.container.querySelector(
      "[name='Choice 3-otherText']"
    )!;
    // Now type in the child textbox
    fireEvent.click(childTextBox);
    fireEvent.change(childTextBox, { target: { value: "Added Text" } });

    // Confirm the text change was made
    expect(childTextBox.value).toBe("Added Text");

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(childTextBox);

    // Make sure the form value is set to with new child text
    expect(mockSetValue).toHaveBeenCalledWith(
      "Choice 3-otherText",
      "Added Text",
      {
        shouldValidate: true,
      }
    );

    // Now uncheck the parent
    fireEvent.click(parentCheckbox);

    // Confirm the checkbox options are unchecked correctly
    const uncheckedOptions = wrapper.getAllByRole("checkbox", {
      checked: false,
    });
    expect(uncheckedOptions).toHaveLength(3);
    expect(parentCheckbox).not.toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(parentCheckbox);

    // Rechecking should show the child textbox doesn't have the 'Added Text' value anymore
    fireEvent.click(parentCheckbox);

    // Confirm the checkbox options are checked correctly
    const recheckedOptions = wrapper.getAllByRole("checkbox", {
      checked: true,
    });
    expect(recheckedOptions).toHaveLength(1);
    expect(parentCheckbox).toBeChecked();

    const childTextBoxCleared: HTMLInputElement =
      wrapper.container.querySelector("[name='Choice 3-otherText']")!;

    expect(childTextBoxCleared.value).toBe("");
  });

  test("Checking and unchecking a checkbox that has a nested radio child sets that radio to its default value (Nothing is checked)", async () => {
    mockGetValues(undefined);

    // Create the Checkbox Component
    const wrapper = render(CheckboxComponentWithNestedChildren);

    const parentCheckbox = wrapper.getByRole("checkbox", { name: "Choice 3" });

    // Make sure default state is set correctly
    expect(parentCheckbox).not.toBeChecked();

    // Select the first Checkbox and check it
    fireEvent.click(parentCheckbox);

    // Confirm the checkbox options are checked correctly
    const checkedOptions = wrapper.getAllByRole("checkbox", {
      checked: true,
    });
    expect(checkedOptions).toHaveLength(1);
    expect(parentCheckbox).toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(parentCheckbox);

    // Make sure the form value is set to what we've clicked (Which is only Choice 3)
    const parentCheckboxData = [{ key: "Choice 3", value: "Choice 3" }];
    expect(mockSetValue).toHaveBeenCalledWith(
      "checkboxFieldWithNestedChildren",
      parentCheckboxData,
      {
        shouldValidate: true,
      }
    );

    // Now check the child radio field
    const childRadioField = wrapper.getByRole("radio", {
      name: "Choice 4",
    });
    fireEvent.click(childRadioField);

    // Confirm the option was checked
    expect(childRadioField).toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(childRadioField);

    // Make sure the form value is set to with new child option
    const childRadioData = [
      { key: "test-nested-child-radio-Choice 4", value: "Choice 4" },
    ];
    expect(mockSetValue).toHaveBeenCalledWith(
      "test-nested-child-radio",
      childRadioData,
      {
        shouldValidate: true,
      }
    );

    // Now uncheck the parent
    fireEvent.click(parentCheckbox);

    // Confirm the checkbox options are unchecked correctly
    const uncheckedOptions = wrapper.getAllByRole("checkbox", {
      checked: false,
    });
    expect(uncheckedOptions).toHaveLength(3);
    expect(parentCheckbox).not.toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(parentCheckbox);

    // Rechecking should show the child radiofield doesn't have any option checked anymore
    fireEvent.click(parentCheckbox);

    // Confirm the checkbox options are checked correctly
    const recheckedOptions = wrapper.getAllByRole("checkbox", {
      checked: true,
    });
    expect(recheckedOptions).toHaveLength(1);
    expect(parentCheckbox).toBeChecked();

    const childRadioCleared: HTMLInputElement =
      wrapper.container.querySelector("[name='Choice 4']")!;

    expect(childRadioCleared).not.toBeChecked;
  });

  test("Selecting and unselecting a radio button that has nested checkbox children sets that checkbox to its default state", () => {
    mockGetValues(undefined);

    // Create the Radio Component
    const wrapper = render(RadioComponentWithNestedChildren);

    const parentRadio = wrapper.getByRole("radio", { name: "Choice 3" });

    // Make sure default state is set correctly
    expect(parentRadio).not.toBeChecked();

    // Select the first Radio button and check it
    fireEvent.click(parentRadio);

    // Confirm the radio options are checked correctly
    const selectedOptions = wrapper.getAllByRole("radio", {
      checked: true,
    });
    expect(selectedOptions).toHaveLength(1);
    expect(parentRadio).toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(parentRadio);

    // Make sure the form value is set to what we've clicked (Which is only Choice 3)
    const parentRadioData = [{ key: "Choice 3", value: "Choice 3" }];
    expect(mockSetValue).toHaveBeenCalledWith(
      "radioFieldWithNestedChildren",
      parentRadioData,
      {
        shouldValidate: true,
      }
    );

    // Now check the child radio field
    const childCheckboxField = wrapper.getByRole("checkbox", {
      name: "Choice 6",
    });
    fireEvent.click(childCheckboxField);

    // Confirm the option was checked
    expect(childCheckboxField).toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(childCheckboxField);

    // Make sure the form value is set to with new child option
    const childCheckboxData = [
      { key: "test-nested-child-checkbox-Choice 6", value: "Choice 6" },
    ];
    expect(mockSetValue).toHaveBeenCalledWith(
      "test-nested-child-checkbox",
      childCheckboxData,
      {
        shouldValidate: true,
      }
    );

    const otherRadio = wrapper.getByRole("radio", { name: "Choice 1" });

    // Now uncheck the parent
    fireEvent.click(otherRadio);

    // Confirm the checkbox options are unchecked correctly
    const unselectedOptions = wrapper.getAllByRole("radio", {
      checked: false,
    });
    expect(unselectedOptions).toHaveLength(2);
    expect(parentRadio).not.toBeChecked();

    // Tab away to trigger onComponentBlur()
    fireEvent.blur(parentRadio);

    // Rechecking should show the child checkbox doesn't have any option checked anymore
    fireEvent.click(parentRadio);

    // Confirm the checkbox options are checked correctly
    const reselectedOptions = wrapper.getAllByRole("radio", {
      checked: true,
    });
    expect(reselectedOptions).toHaveLength(1);
    expect(parentRadio).toBeChecked();

    const childCheckboxCleared: HTMLInputElement =
      wrapper.container.querySelector("[name='Choice 6']")!;

    expect(childCheckboxCleared).not.toBeChecked;
  });
});

describe("Test getNestedChildFieldsOfUncheckedParent function", () => {
  const checkboxChoiceWithNoChildren = {
    id: "checkboxWithNoChild",
    label: "State Medicaid agency staff",
    value: "State Medicaid agency staff",
    name: "checkboxWithNoChild",
    checked: false,
  };

  const checkboxChoiceWithRadioChild = {
    id: "checkboxWithRadioChild",
    label: "Proprietary system(s)",
    children: [
      {
        id: "radioChild",
        type: "radio",
        validation: "radio",
        props: {
          label: "Radio Child Label",
          hint: "Radio Child Hint",
          choices: [
            {
              id: "radioChild-1",
              label: "Yes",
              value: "Yes",
              name: "radioChild-1",
              checked: false,
            },
            {
              id: "radioChild-2",
              label: "No",
              value: "No",
              name: "radioChild-2",
              checked: false,
            },
          ],
        },
      },
    ],
    value: "Proprietary system(s)",
    name: "checkboxWithRadioChild",
    checked: false,
  };

  const checkboxChoiceWithTextFieldChild = {
    id: "checkboxWithTextChild",
    label: "Other, specify",
    children: [
      {
        id: "checkboxWithTextChild-otherText",
        type: "textarea",
        validation: "",
        props: {},
      },
    ],
    value: "Other, specify",
    name: "checkboxWithTextChild",
    checked: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Checking the checkbox choice and the user has never filled the field out the form before, it returns empty", async () => {
    const initialDatabaseValue: Choice[] = [];
    const choices = [{ ...checkboxChoiceWithNoChildren, checked: true }];
    const returnedValue = getNestedChildFieldsOfUncheckedParent(
      choices,
      initialDatabaseValue
    );

    expect(returnedValue).toStrictEqual([]);
  });

  test("Unchecking the checkbox choice and the user HAS filled the field out the form before, it returns empty", async () => {
    const initialDatabaseValue: Choice[] = [
      {
        key: "checkboxWithNoChild",
        value: "State Medicaid agency staff",
      },
    ];
    const choices = [checkboxChoiceWithNoChildren];
    const returnedValue = getNestedChildFieldsOfUncheckedParent(
      choices,
      initialDatabaseValue
    );

    expect(returnedValue).toStrictEqual([]);
  });

  test("Checking the radio choice and the user has never filled the field out the form before, it returns empty", async () => {
    const initialDatabaseValue: Choice[] = [];
    const choices = [{ ...checkboxChoiceWithRadioChild, checked: true }];
    const returnedValue = getNestedChildFieldsOfUncheckedParent(
      choices,
      initialDatabaseValue
    );

    expect(returnedValue).toStrictEqual([]);
  });

  test("Unchecking the radio choice and the user HAS filled the field out the form before, it returns the child object", async () => {
    const initialDatabaseValue: Choice[] = [
      {
        key: "checkboxWithRadioChild",
        value: "Proprietary system(s)",
      },
    ];
    const choices = [checkboxChoiceWithRadioChild];
    const returnedValue = getNestedChildFieldsOfUncheckedParent(
      choices,
      initialDatabaseValue
    );

    const expectedReturn = [
      {
        name: "radioChild",
        type: "radio",
        value: [],
        overrideCheck: true,
      },
    ];

    expect(returnedValue).toStrictEqual(expectedReturn);
  });

  test("Checking the choice and the user has never filled the field out the form before, it returns empty", async () => {
    const initialDatabaseValue: Choice[] = [];
    const choices = [{ ...checkboxChoiceWithTextFieldChild, checked: true }];
    const returnedValue = getNestedChildFieldsOfUncheckedParent(
      choices,
      initialDatabaseValue
    );

    expect(returnedValue).toStrictEqual([]);
  });

  test("Unchecking the choice and the user HAS filled the field out the form before, it returns the child object", async () => {
    const initialDatabaseValue: Choice[] = [
      {
        key: "checkboxWithTextChild",
        value: "Other, specify",
      },
    ];
    const choices = [checkboxChoiceWithTextFieldChild];
    const returnedValue = getNestedChildFieldsOfUncheckedParent(
      choices,
      initialDatabaseValue
    );

    const expectedReturn = [
      {
        name: "checkboxWithTextChild-otherText",
        type: "textarea",
        value: "",
        overrideCheck: true,
      },
    ];
    expect(returnedValue).toStrictEqual(expectedReturn);
  });
});

describe("Test ChoiceList accessibility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should not have basic accessibility issues when given CheckboxField", async () => {
    const { container } = render(CheckboxComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues when given CheckboxField with children", async () => {
    const { container } = render(CheckboxComponentWithNestedChildren);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues when given RadioField", async () => {
    const { container } = render(RadioComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues when given RadioField with children", async () => {
    const { container } = render(RadioComponentWithNestedChildren);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
