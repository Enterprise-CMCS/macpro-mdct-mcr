import { addPlanChoices, formModifications } from "./formModifications";
// types
import { ReportType } from "types";
// verbiage
import accordionVerbiage from "verbiage/pages/accordion";

const plans = [
  {
    id: "mock-plan-1",
    name: "Mock Plan",
  },
];

const choices = [
  {
    id: "mock-plan-1",
    label: "Mock Plan",
  },
];

const mockTextField = {
  id: "mockTextField",
  type: "text",
  validation: "text",
  props: {
    label: "Mock label",
  },
};

const mockExemptionsInput = {
  id: "plansExemptFromQualityMeasures",
  type: "checkbox",
  validation: "checkboxOptional",
  props: {
    label: "Mock label",
    choices: [
      {
        label: "Mock choices",
      },
    ],
  },
};

const mockExemptionsOutput = {
  ...mockExemptionsInput,
  props: {
    ...mockExemptionsInput.props,
    choices,
  },
};

describe("utils/forms/mcparPlanExemption", () => {
  describe("addPlanChoices()", () => {
    it("add plans to form", () => {
      const plansExemptFromQualityMeasures = {
        id: "mockForm",
        fields: [mockTextField, mockExemptionsInput],
      };

      const input = addPlanChoices(plansExemptFromQualityMeasures, plans);
      const expectedResult = {
        id: "mockForm",
        fields: [mockTextField, mockExemptionsOutput],
      };

      expect(input).toEqual(expectedResult);
    });

    it("does not add plans to form", () => {
      const noMatch = {
        id: "mockForm",
        fields: [
          mockTextField,
          {
            id: "noMatch",
            type: "checkbox",
            validation: "checkboxOptional",
            props: {
              label: "Mock label",
              choices: [
                {
                  label: "Mock choices",
                },
              ],
            },
          },
        ],
      };
      const input = addPlanChoices(noMatch, plans);
      const expectedResult = { ...noMatch };

      expect(input).toEqual(expectedResult);
    });
  });

  describe("formModifications()", () => {
    it("modifies the form", () => {
      const route = {
        name: "Mock route",
        path: "/mcpar/plan-level-indicators/quality-measures/new-plan-exemption",
        form: {
          id: "mockForm",
          fields: [mockTextField, mockExemptionsInput],
        },
        verbiage: {
          intro: {
            section: "Mock section",
          },
        },
      };

      const fieldData = {
        plans,
      };

      const input = formModifications(ReportType.MCPAR, route, fieldData);

      const expectedResult = {
        accordion: accordionVerbiage.MCPAR.formIntro,
        formJson: {
          id: "mockForm",
          fields: [mockTextField, mockExemptionsOutput],
        },
      };

      expect(input).toEqual(expectedResult);
    });

    it("does not modify the form", () => {
      const route = {
        name: "Mock route",
        path: "/mock-route",
        form: {
          id: "mockForm",
          fields: [mockTextField],
        },
        verbiage: {
          intro: {
            section: "Mock section",
          },
        },
      };

      const fieldData = {
        plans,
      };

      const input = formModifications(ReportType.MLR, route, fieldData);
      const expectedResult = {
        formJson: {
          id: "mockForm",
          fields: [mockTextField],
        },
      };

      expect(input).toEqual(expectedResult);
    });
  });
});
