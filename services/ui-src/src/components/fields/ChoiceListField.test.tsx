import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
//components
import { useFormContext } from "react-hook-form";
import { ChoiceListField, ReportContext } from "components";
import { formFieldFactory, useUser } from "utils";
import {
  mockReportContext,
  mockStateUser,
  mockAdminUser,
} from "utils/testing/setupJest";
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

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

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
      choices: [...mockChoices],
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
      onChangeHandler={() => jest.fn()}
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
      onChangeHandler={() => jest.fn()}
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
      onChangeHandler={() => jest.fn()}
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
      onChangeHandler={() => jest.fn()}
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
      onChangeHandler={() => jest.fn()}
      autosave
    />
  </ReportContext.Provider>
);

describe("Test ChoiceListField component rendering", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
  });

  it("RadioField should render nested child fields for choices with children", () => {
    render(RadioComponentWithNestedChildren);
    expect(formFieldFactory).toHaveBeenCalledWith(mockNestedChildren, {
      disabled: false,
      nested: true,
    });
  });

  it("CheckboxField should render nested child fields for choices with children", () => {
    render(CheckboxComponentWithNestedChildren);
    expect(formFieldFactory).toHaveBeenCalledWith(mockNestedChildren, {
      disabled: false,
      nested: true,
    });
  });
});

describe("Test ChoiceListField hydration functionality", () => {
  const mockFormFieldValue = [{ key: "checkbox-field", value: "Choice 2" }];
  const mockHydrationValue = [
    { key: "checkbox-field-with-hydration-value", value: "Choice 1" },
  ];

  const RadioComponentWithHydrationValue = (
    <ChoiceListField
      choices={mockChoices}
      label="Radio example"
      name="radio-field-with-hydration-value"
      type="radio"
      hydrate={mockHydrationValue}
      onChangeHandler={() => jest.fn()}
    />
  );
  const CheckboxComponentWithHydrationValue = (
    <ChoiceListField
      choices={mockChoices}
      label="Checkbox example"
      name="checkbox-field-with-hydration-value"
      type="checkbox"
      hydrate={mockHydrationValue}
      onChangeHandler={() => jest.fn()}
    />
  );

  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
  });

  test("For CheckboxField, if only formFieldValue exists, displayValue is set to it", () => {
    mockGetValues(mockFormFieldValue);
    render(CheckboxComponent);
    expect(mockSetValue).toHaveBeenCalledWith(
      "checkbox-field",
      mockFormFieldValue,
      {
        shouldValidate: true,
      }
    );
  });

  test("For CheckboxField, if only hydrationValue exists, displayValue is set to it", async () => {
    mockGetValues(undefined);
    render(CheckboxComponentWithHydrationValue);
    const checkBox1 = screen.getByText("Choice 1");
    expect(checkBox1).toBeVisible();

    await act(async () => {
      await userEvent.click(checkBox1);
    });

    expect(mockSetValue).toHaveBeenCalledWith(
      "checkbox-field-with-hydration-value",
      mockHydrationValue,
      {
        shouldValidate: true,
      }
    );
  });

  test("For CheckboxField, if both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
    mockGetValues(mockFormFieldValue);
    render(CheckboxComponentWithHydrationValue);
    expect(mockSetValue).toHaveBeenCalledWith(
      "checkbox-field-with-hydration-value",
      mockFormFieldValue,
      {
        shouldValidate: true,
      }
    );
  });

  test("For RadioField, if only formFieldValue exists, displayValue is set to it", () => {
    mockGetValues(mockFormFieldValue);
    render(RadioComponent);
    expect(mockSetValue).toHaveBeenCalledWith(
      "radio-field",
      mockFormFieldValue,
      {
        shouldValidate: true,
      }
    );
  });

  test("For RadioField, if only hydrationValue exists, displayValue is set to it", () => {
    mockGetValues(undefined);
    render(RadioComponentWithHydrationValue);
    expect(mockSetValue).toHaveBeenCalledWith(
      "radio-field-with-hydration-value",
      mockHydrationValue,
      {
        shouldValidate: true,
      }
    );
  });

  test("For RadioField, if both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
    mockGetValues(mockFormFieldValue);
    render(RadioComponentWithHydrationValue);
    expect(mockSetValue).toHaveBeenCalledWith(
      "radio-field-with-hydration-value",
      mockFormFieldValue,
      {
        shouldValidate: true,
      }
    );
  });
});

describe("Test Choicelist component autosaves", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Choicelist Checkbox autosaves with checked value when stateuser, autosave true, and form is valid", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockGetValues(undefined);
    const mockHydrationValue = [{ key: "Choice 1", value: "Choice 1" }];
    render(CheckboxComponentAutosave);
    const checkBox1 = screen.getByText("Choice 1");
    expect(checkBox1).toBeVisible();

    await act(async () => {
      await userEvent.click(checkBox1);
    });

    expect(mockSetValue).toHaveBeenCalledWith(
      "autosaveCheckboxField",
      mockHydrationValue,
      {
        shouldValidate: true,
      }
    );

    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(1);
    expect(mockReportContext.updateReport).toHaveBeenCalledWith(
      {
        state: mockStateUser.user?.state,
        id: mockReportContext.report.id,
      },
      {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: mockStateUser.user?.full_name,
        fieldData: {
          autosaveCheckboxField: mockHydrationValue,
        },
      }
    );
  });

  test("Choicelist Checkbox does NOT autosaves with checked value when adminuser, autosave true, and form is valid", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    mockGetValues(undefined);
    const mockHydrationValue = [{ key: "Choice 1", value: "Choice 1" }];
    render(CheckboxComponentAutosave);
    const checkBox1 = screen.getByText("Choice 1");
    expect(checkBox1).toBeVisible();

    await act(async () => {
      await userEvent.click(checkBox1);
    });

    expect(mockSetValue).toHaveBeenCalledWith(
      "autosaveCheckboxField",
      mockHydrationValue,
      {
        shouldValidate: true,
      }
    );

    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(0);
  });

  test("Choicelist Checkbox does NOT autosaves with checked value when stateuser, autosave false, and form is valid", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockGetValues(undefined);
    const mockHydrationValue = [{ key: "Choice 1", value: "Choice 1" }];
    render(CheckboxComponent);
    const checkBox1 = screen.getByText("Choice 1");
    expect(checkBox1).toBeVisible();

    await act(async () => {
      await userEvent.click(checkBox1);
    });

    expect(mockSetValue).toHaveBeenCalledWith(
      "checkbox-field",
      mockHydrationValue,
      {
        shouldValidate: true,
      }
    );

    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(0);
  });
});

describe("Test ChoiceListField accessibility", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
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
