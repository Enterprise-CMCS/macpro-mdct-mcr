import { generateIlosFields, isIlosCompleted } from "utils";
import { FormJson, AnyObject, EntityShape } from "types";

const mockForm: FormJson = {
  id: "mock-id",
  fields: [
    {
      id: "mock-field-id",
      props: {
        choices: [
          {
            id: "mock-choice-id-1",
            label: "mock label 1",
          },
          {
            id: "mock-choice-id-2",
            label: "mock label 2",
            children: [
              {
                id: "mock-child-id",
                type: "checkbox",
                validation: {
                  type: "checkbox",
                  nested: true,
                  parentFieldName: "mock-field-id",
                  parentOptionId: "mock-field-id-mock-choice-id-2",
                },
                props: {
                  choices: [],
                },
              },
            ],
          },
        ],
      },
      type: "radio",
      validation: "radio",
    },
  ],
};

const mockIlos: AnyObject[] = [
  {
    id: "mock-ilos-1",
    name: "ilos 1",
  },
  {
    id: "mock-ilos-2",
    name: "ilos 2",
  },
];

const mockCompleteIlosEntity: EntityShape = {
  id: "mock-complete-ilos",
  plan_ilosOfferedByPlan: [
    {
      key: "mock-key",
      value: "Yes",
    },
  ],
  plan_ilosUtilizationByPlan: [
    {
      id: "mock-ilos",
      name: "ilos",
    },
  ],
};

const mockIncompleteIlosEntity: EntityShape = {
  id: "mock-incomplete-ilos",
};

describe("generateIlosFields", () => {
  const result = generateIlosFields(mockForm, mockIlos);
  it("should generate checkboxes per each available ILOS", () => {
    expect(result.fields[0].props.choices.length).toBe(2);
  });

  it("each ILOS checkbox should have a nested text field of type number", () => {
    result.fields[0].props.choices[1].children[0].props.choices.map(
      (choice: AnyObject) => {
        expect(choice.children);
        expect(choice.children[0].type).toBe("number");
      }
    );
  });
});

describe("isIlosCompleted", () => {
  it("should return TRUE if entity is complete", () => {
    const result = isIlosCompleted(true, mockCompleteIlosEntity);
    expect(result).toBe(true);
  });
  it("should return FALSE if entity is incomplete", () => {
    const result = isIlosCompleted(true, mockIncompleteIlosEntity);
    expect(result).toBe(false);
  });
});
