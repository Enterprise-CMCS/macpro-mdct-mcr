import { mockDropdownOptions } from "./mockDropdownChoices";

// Choicelist
export const mockSingleChoice = [
  {
    id: "Choice 1",
    name: "Choice 1",
    label: "Choice 1",
    value: "Choice 1",
    checked: false,
  },
];

export const mockChoices = [
  ...mockSingleChoice,
  {
    id: "Choice 2",
    name: "Choice 2",
    label: "Choice 2",
    value: "Choice 2",
    checked: false,
  },
];

export const mockNestedChoices = [
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

export const mockNestedCheckboxChoices = [
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

export const mockNestedChildren = [
  {
    id: "Choice 3-otherText",
    name: "Choice 3-otherText",
    type: "text",
  },
  {
    id: "test-nested-child-radio",
    type: "radio",
    disabled: true,
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
  {
    id: "test-nested-child-disabled-date",
    type: "date",
    disabled: true,
    label: "Mock Date 1",
    value: "Mock Date 1",
  },
];

export const mockChoiceWithChild = {
  id: "Choice 3",
  name: "Choice 3",
  label: "Choice 3",
  value: "Choice 3",
  checked: false,
  children: mockNestedChildren,
};
