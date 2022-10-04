import { render } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { useFormContext } from "react-hook-form";
import { ChoiceListField } from "components";
import { formFieldFactory } from "utils";

const mockSetValue = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: mockSetValue,
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

jest.mock("utils", () => ({
  makeMediaQueryClasses: () => {},
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
  <ChoiceListField
    choices={mockChoices}
    label="Checkbox example"
    name="checkbox-field"
    type="checkbox"
    onChangeHandler={() => jest.fn()}
  />
);

const CheckboxComponentWithNestedChildren = (
  <ChoiceListField
    choices={[...mockChoices, mockChoiceWithChild]}
    label="Radio example"
    name="checkbox-field-with-nested-children"
    type="checkbox"
    onChangeHandler={() => jest.fn()}
  />
);

const RadioComponent = (
  <ChoiceListField
    choices={mockChoices}
    label="Radio example"
    name="radio-field"
    type="radio"
    onChangeHandler={() => jest.fn()}
  />
);

const RadioComponentWithNestedChildren = (
  <ChoiceListField
    choices={[...mockChoices, mockChoiceWithChild]}
    label="Radio example"
    name="radio-field-with-nested-children"
    type="radio"
    onChangeHandler={() => jest.fn()}
  />
);

describe("Test ChoiceListField component rendering", () => {
  it("RadioField should render nested child fields for choices with children", () => {
    render(RadioComponentWithNestedChildren);
    expect(formFieldFactory).toHaveBeenCalledWith(
      mockNestedChildren,
      false,
      true
    );
  });

  it("CheckboxField should render nested child fields for choices with children", () => {
    render(CheckboxComponentWithNestedChildren);
    expect(formFieldFactory).toHaveBeenCalledWith(
      mockNestedChildren,
      false,
      true
    );
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

  test("For CheckboxField, if only hydrationValue exists, displayValue is set to it", () => {
    mockGetValues(undefined);
    render(CheckboxComponentWithHydrationValue);
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

describe("Test ChoiceListField accessibility", () => {
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
