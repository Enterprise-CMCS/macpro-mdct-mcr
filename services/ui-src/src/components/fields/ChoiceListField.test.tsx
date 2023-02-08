import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
//components
import { useFormContext } from "react-hook-form";
import { ChoiceListField, ReportContext } from "components";
import { formFieldFactory } from "utils";
import { mockReportContext } from "utils/testing/setupJest";
import { ReportStatus } from "types";

const mockTrigger = jest.fn();
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

jest.mock("utils/forms/forms", () => ({
  formFieldFactory: jest.fn(),
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
    id: "test-nested-child-text",
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
  <ReportContext.Provider value={mockReportContext}>
    <ChoiceListField
      choices={mockChoices}
      label="Checkbox example"
      name="checkbox-field"
      type="checkbox"
    />
  </ReportContext.Provider>
);

const CheckboxComponentWithNestedChildren = (
  <ReportContext.Provider value={mockReportContext}>
    <ChoiceListField
      choices={[...mockChoices, mockChoiceWithChild]}
      label="Radio example"
      name="checkbox-field-with-nested-children"
      type="checkbox"
    />
  </ReportContext.Provider>
);

const RadioComponentWithNestedChildren = (
  <ReportContext.Provider value={mockReportContext}>
    <ChoiceListField
      choices={[...mockChoices, mockChoiceWithChild]}
      label="Radio example"
      name="radio-field-with-nested-children"
      type="radio"
    />
  </ReportContext.Provider>
);

const RadioComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <ChoiceListField
      choices={mockChoices}
      label="Radio example"
      name="radio-field"
      type="radio"
    />
  </ReportContext.Provider>
);

const CheckboxComponentAutosave = (
  <ReportContext.Provider value={mockReportContext}>
    <ChoiceListField
      choices={mockChoices}
      label="Checkbox example"
      name="autosaveCheckboxField"
      type="checkbox"
      autosave
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
    render(RadioComponentWithNestedChildren);
    expect(formFieldFactory).toHaveBeenCalledWith(mockNestedChildren, {
      disabled: false,
      nested: true,
    });
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByText("Choice 2")).toBeVisible();
    expect(screen.getByText("Choice 3")).toBeVisible();
  });

  /*
   * it("CheckboxField should render nested child fields for choices with children", async () => {
   *   // Create the Checkbox Component
   *   const wrapper = render(CheckboxComponentWithNestedChildren);
   */

  /*
   *   expect(screen.getByText("Choice 1")).toBeVisible();
   *   expect(screen.getByText("Choice 2")).toBeVisible();
   *   expect(screen.getByText("Choice 3")).toBeVisible();
   *   expect(formFieldFactory).toHaveBeenCalledWith(mockNestedChildren, {
   *     disabled: false,
   *     nested: true,
   *   });
   */

  //   // Also ask about why this isn't showing Choices 4 and 5. Is it because formFieldFactory doesn't do a real render since its a jest.fn()?

  /*
   *   // Grab the Checkboxes in the component
   *   const checkboxContainers = wrapper.container.querySelectorAll(
   *     ".ds-c-choice-wrapper"
   *   );
   *   const checkboxWithChildren = checkboxContainers[2]
   *     .children[0] as HTMLInputElement;
   *   await userEvent.click(checkboxWithChildren);
   *   expect(checkboxWithChildren).toBeChecked();
   *   expect(screen.getByText("Choice 4")).toBeVisible();
   *   expect(screen.getByText("Choice 5")).toBeVisible();
   * });
   */
});

describe("Test Choicelist component autosaves", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("Choicelist Checkbox autosaves with checked value when autosave true, and form is valid", async () => {
    mockGetValues(undefined);

    // Create the Checkbox Component
    const wrapper = render(CheckboxComponentAutosave);

    // Grab the Checkboxs in the component
    const checkboxContainers = wrapper.container.querySelectorAll(
      ".ds-c-choice-wrapper"
    );

    const firstCheckbox = checkboxContainers[0].children[0] as HTMLInputElement;
    const secondCheckbox = checkboxContainers[1]
      .children[0] as HTMLInputElement;

    // Select the first Checkbox and check it
    expect(firstCheckbox).not.toBeChecked();
    expect(secondCheckbox).not.toBeChecked();
    const mockSelectedChoice = [{ key: "Choice 1", value: "Choice 1" }];
    await userEvent.click(firstCheckbox);

    /*
     * Tab away to trigger onComponentBlur()
     * TODO: See why this tab isn't actually needed to fire this event
     */
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    // Confirm the checkboxes are checked correctly
    expect(firstCheckbox).toBeChecked();
    expect(secondCheckbox).not.toBeChecked();

    // whats a better way to handle this?

    /*
     * Need a setTimeout here to make sure that the setTimeout in ChoiceListField's onComponentBlur Autosave fires first. It's set
     * to 400 to ensure it fires after the 200 thats set in ChoiceListField
     */

    // Make sure the form value is set to what we've clicked (Which is only Choice 1)
    expect(mockSetValue).toHaveBeenCalledWith(
      "autosaveCheckboxField",
      mockSelectedChoice,
      {
        shouldValidate: true,
      }
    );

    // Ensure we call autosave with the correct data
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(1);
    expect(mockReportContext.updateReport).toHaveBeenCalledWith(
      {
        id: mockReportContext.report.id,
      },
      {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
        },
        fieldData: {
          autosaveCheckboxField: mockSelectedChoice,
        },
      }
    );
  });

  test("Choicelist Radiofield autosaves with checked value when autosave true, and form is valid", async () => {
    mockGetValues(undefined);

    // Create the Checkbox Component
    const wrapper = render(CheckboxComponentAutosave);

    // Grab the Checkboxs in the component
    const radioFieldContainers = wrapper.container.querySelectorAll(
      ".ds-c-choice-wrapper"
    );
    const firstRadio = radioFieldContainers[0].children[0] as HTMLInputElement;
    const secondRadio = radioFieldContainers[0].children[1] as HTMLInputElement;

    // Select the first Checkbox and check it
    const mockSelectedChoice = [{ key: "Choice 1", value: "Choice 1" }];
    await userEvent.click(firstRadio);

    /*
     * Tab away to trigger onComponentBlur()
     * TODO: See why this tab isn't actually needed to fire this event
     */
    await userEvent.tab();

    // Confirm the checkboxes are checked correctly
    expect(firstRadio).toBeChecked();
    expect(secondRadio).not.toBeChecked();

    // whats a better way to handle this?

    /*
     * Need a setTimeout here to make sure that the setTimeout in ChoiceListField's onComponentBlur Autosave fires first. It's set
     * to 400 to ensure it fires after the 200 thats set in ChoiceListField
     */
    setTimeout(async () => {
      // Ensure we call autosave with the correct data
      expect(mockSetValue).toHaveBeenCalledWith(
        "autosaveRadioField",
        mockSelectedChoice,
        {
          shouldValidate: true,
        }
      );
      expect(mockReportContext.updateReport).toHaveBeenCalledTimes(1);
      expect(mockReportContext.updateReport).toHaveBeenCalledWith(
        {
          id: mockReportContext.report.id,
        },
        {
          metadata: {
            status: ReportStatus.IN_PROGRESS,
          },
          fieldData: {
            autosaveRadioField: mockSelectedChoice,
          },
        }
      );
    }, 800);
  });
});

describe("Test ChoiceListField accessibility", () => {
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
