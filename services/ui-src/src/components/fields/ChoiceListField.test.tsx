import { render } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ChoiceListField } from "components";
import { formFieldFactory } from "utils";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    register: () => {},
    setValue: () => {},
    getValues: () => {},
  }),
}));

jest.mock("utils", () => ({
  makeMediaQueryClasses: () => {},
  formFieldFactory: jest.fn(),
}));

const mockChoices = [
  { name: "Choice 1", label: "Choice 1", value: "Choice 1" },
  { name: "Choice 2", label: "Choice 2", value: "Choice 2" },
];

const mockNestedChildren = [
  {
    id: "test-nested-child",
    type: "text",
  },
];

const mockChoiceWithChild = {
  name: "Choice 3",
  label: "Choice 3",
  value: "Choice 3",
  children: mockNestedChildren,
};

const ChoiceListFieldCheckboxComponent = (
  <div data-testid="test-checkbox-list">
    <ChoiceListField
      choices={mockChoices}
      label="Checkbox example"
      name="checkbox_choices"
      type="checkbox"
      onChangeHandler={() => jest.fn()}
    />
  </div>
);

const ChoiceListFieldComponentToHydrate = (
  <div data-testid="test-choice-list-hydrate">
    <ChoiceListField
      choices={mockChoices}
      label="Checkbox example"
      name="choicelist-hydrate"
      type="checkbox"
      hydrate="Choice 1"
      onChangeHandler={() => jest.fn()}
    />
  </div>
);

const ChoiceListFieldRadioComponent = (
  <div data-testid="test-radio-list">
    <ChoiceListField
      choices={mockChoices}
      label="Radio example"
      name="radio_choices"
      type="radio"
      onChangeHandler={() => jest.fn()}
    />
  </div>
);

const ChoiceListFieldWithNestedChildren = (
  <div data-testid="test-radio-list">
    <ChoiceListField
      choices={[...mockChoices, mockChoiceWithChild]}
      label="Radio example"
      name="radio_choices"
      type="radio"
      onChangeHandler={() => jest.fn()}
    />
  </div>
);

describe("Test ChoiceList component", () => {
  it("Should render nested child fields for choices with children", () => {
    render(ChoiceListFieldWithNestedChildren);
    expect(formFieldFactory).toHaveBeenCalledWith(mockNestedChildren, true);
  });

  test("If hydration prop exists it is set as value", () => {
    const result = render(ChoiceListFieldComponentToHydrate);
    const field: HTMLInputElement = result.container.querySelector(
      "[name='choicelist-hydrate']"
    )!;
    expect(field.value).toEqual("Choice 1");
  });
});

describe("Test ChoiceList accessibility", () => {
  it("Should not have basic accessibility issues when given checkbox", async () => {
    const { container } = render(ChoiceListFieldCheckboxComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues when given radio", async () => {
    const { container } = render(ChoiceListFieldRadioComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
