// import as star so we can spy on functions
import * as completionStatus from "./completionStatus";
// types
import {
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../types";
// utils
import {
  mockDrawerReportPageJson,
  mockFormField,
  mockModalDrawerReportPageJson,
  mockModalOverlayReportPageJson,
  mockStandardReportPageJson,
} from "../testing/mocks/mockForm";
import { mockReportJson } from "../testing/setupJest";

const {
  areFieldsValid,
  calculateCompletionStatus,
  calculateEntityCompletion,
  calculateFormCompletion,
  calculateRouteCompletion,
  calculateRoutesCompletion,
  getNestedFields,
  isComplete,
} = completionStatus;

const mockValidator = jest.fn();
jest.mock("./validation", () => ({
  validateFieldData: () => mockValidator(),
}));

describe("Completion Status Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("isComplete()", () => {
    test("returns false if a key is false", () => {
      const mockStatuses = {
        key1: false,
        key2: true,
      };
      expect(isComplete(mockStatuses)).toBe(false);
    });
    test("returns false if a nested key is false", () => {
      const nestedFalseStatus = {
        key1: true,
        key2: {
          keya: false,
        },
      };
      expect(isComplete(nestedFalseStatus)).toBe(false);
    });

    test("returns true if all keys are true", () => {
      const allTrueStatus = {
        key1: true,
        key2: {
          keya: true,
        },
      };
      expect(isComplete(allTrueStatus)).toBe(true);
    });
  });

  describe("areFieldsValid()", () => {
    test("returns false when validation fails", async () => {
      mockValidator.mockReturnValue(undefined);
      const result = await areFieldsValid({}, {});
      expect(result).toEqual(false);
    });

    test("returns true when validation succeeds", async () => {
      mockValidator.mockReturnValue({});
      const result = await areFieldsValid({}, {});
      expect(result).toEqual(true);
    });

    test("returns false when validation throws error", async () => {
      mockValidator.mockImplementation(() => {
        throw new Error("failure");
      });
      const result = await areFieldsValid({}, {});
      expect(result).toEqual(false);
    });
  });

  describe("getNestedFields()", () => {
    const nestedFieldId = "nested-field-1";
    const mockFieldChoices = [
      {
        id: "choice_1",
        name: "",
        value: "",
        label: "Choice 1",
        children: [
          {
            id: nestedFieldId,
            type: ReportFormFieldType.TEXT,
            validation: ValidationType.TEXT,
          },
        ],
      },
      {
        id: "choice_2",
        name: "",
        value: "",
        label: "Choice 2",
        children: [],
      },
      {
        id: "choice_3",
        name: "",
        value: "",
        label: "Choice 3",
        children: [
          {
            id: `${nestedFieldId}-1`,
            type: ReportFormFieldType.RADIO,
            validation: ValidationType.RADIO,
            props: {
              choices: [
                {
                  id: "choice_4",
                  label: "Choice 4",
                  children: [
                    {
                      id: `${nestedFieldId}-2`,
                      type: ReportFormFieldType.TEXT,
                      validation: ValidationType.TEXT,
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ];
    const mockDataForObject = {
      "field-1": "data 1",
      "field-2": "data 2",
      [nestedFieldId]: "data 3",
      [`${nestedFieldId}-1`]: [
        {
          key: "choice_4",
        },
      ],
    };
    test("returns nested field id when nested field under selected choice", () => {
      const selectedChoiceIds = [
        {
          key: "choice_1",
          value: "Choice 1",
        },
        {
          key: "choice_3",
          value: "Choice 3",
        },
        {
          key: "choice_4",
          value: "Choice 4",
        },
      ];
      const result = getNestedFields(
        mockFieldChoices,
        selectedChoiceIds,
        mockDataForObject
      );
      expect(result).toEqual([
        nestedFieldId,
        `${nestedFieldId}-1`,
        `${nestedFieldId}-2`,
      ]);
    });

    test("returns no ids when choice has no child fields", () => {
      const selectedChoice2 = [
        {
          key: "choice_2",
          value: "Choice 2",
        },
      ];
      const result = getNestedFields(
        mockFieldChoices,
        selectedChoice2,
        mockDataForObject
      );
      expect(result).toEqual([]);
    });
  });

  describe("calculateFormCompletion()", () => {
    const mockFormTemplate = {
      id: "mock-form",
      fields: [mockFormField],
    };
    const validatorSpy = jest.spyOn(completionStatus, "areFieldsValid");
    const nestedFieldSpy = jest.spyOn(completionStatus, "getNestedFields");
    test("returns false when validation returns false", async () => {
      validatorSpy.mockResolvedValue(false);
      const result = await calculateFormCompletion(
        mockFormTemplate,
        {},
        {},
        {}
      );
      expect(result).toBe(false);
    });

    test("returns true when validation returns true", async () => {
      validatorSpy.mockResolvedValue(true);
      const result = await calculateFormCompletion(
        mockFormTemplate,
        {},
        {},
        {}
      );
      expect(result).toBe(true);
    });

    test("gets nested fields when data is array", async () => {
      validatorSpy.mockResolvedValue(true);
      const result = await calculateFormCompletion(
        mockFormTemplate,
        {
          [mockFormField.id]: [],
        },
        {},
        {}
      );
      expect(result).toBe(true);
      expect(nestedFieldSpy).toHaveBeenCalled();
    });

    test("handles repeated fields", async () => {
      const mockFormTemplate = {
        id: "mock-form",
        fields: [
          {
            ...mockFormField,
            repeat: "repeater",
          },
        ],
      };
      validatorSpy.mockResolvedValue(true);
      const result = await calculateFormCompletion(
        mockFormTemplate,
        {
          [mockFormField.id]: [],
        },
        {
          repeater: ["test repeater"],
        },
        {}
      );
      expect(result).toBe(true);
      expect(nestedFieldSpy).not.toHaveBeenCalled();
    });

    test("returns false if field data doesn't contain repeated fields", async () => {
      const mockFormTemplate = {
        id: "mock-form",
        fields: [
          {
            ...mockFormField,
            repeat: "repeater",
          },
        ],
      };
      validatorSpy.mockResolvedValue(true);
      const result = await calculateFormCompletion(
        mockFormTemplate,
        {
          [mockFormField.id]: [],
        },
        {},
        {}
      );
      expect(result).toBe(false);
      expect(nestedFieldSpy).not.toHaveBeenCalled();
    });
  });

  describe("calculateEntityCompletion()", () => {
    const mockFormTemplate = [
      {
        id: "mock-form",
        fields: [mockFormField],
      },
    ];
    const formCompletionSpy = jest.spyOn(
      completionStatus,
      "calculateFormCompletion"
    );
    test("returns false if entity is required and not data provided", async () => {
      const result = await calculateEntityCompletion(
        mockFormTemplate,
        EntityType.PLANS,
        {},
        {},
        {
          entities: { [EntityType.PLANS]: { required: true } },
        }
      );
      expect(result).toBe(false);
    });

    test("returns true if entity is not required", async () => {
      const result = await calculateEntityCompletion(
        mockFormTemplate,
        EntityType.PLANS,
        {},
        {},
        {
          entities: { [EntityType.PLANS]: { required: false } },
        }
      );
      expect(result).toBe(true);
    });

    test("returns false if form completion ever returns false", async () => {
      formCompletionSpy.mockResolvedValue(false);
      const result = await calculateEntityCompletion(
        mockFormTemplate,
        EntityType.PLANS,
        {
          [EntityType.PLANS]: [
            {
              id: "test-data",
              value: "test data",
            },
          ],
        },
        {},
        {
          entities: { [EntityType.PLANS]: { required: false } },
        }
      );
      expect(result).toBe(false);
    });

    test("returns true if form completion always returns true", async () => {
      formCompletionSpy.mockResolvedValue(true);
      const result = await calculateEntityCompletion(
        mockFormTemplate,
        EntityType.PLANS,
        {
          [EntityType.PLANS]: [
            {
              id: "test-data",
              value: "test data",
            },
          ],
        },
        {},
        {
          entities: { [EntityType.PLANS]: { required: false } },
        }
      );
      expect(result).toBe(true);
    });
  });

  describe("calculateRouteCompletion()", () => {
    const formCompletionSpy = jest.spyOn(
      completionStatus,
      "calculateFormCompletion"
    );
    const entityCompletionSpy = jest.spyOn(
      completionStatus,
      "calculateEntityCompletion"
    );
    describe("case: default", () => {
      test("returns undefined by default if route has no matching type and no children", async () => {
        const result = await calculateRouteCompletion(
          {
            name: "path with neither form nor child",
            path: "/void",
          },
          {},
          {},
          {}
        );
        expect(result).toEqual(undefined);
      });

      test("calls calculateRoutesCompletion if route has no matching type but has children", async () => {
        const routesCompletionSpy = jest.spyOn(
          completionStatus,
          "calculateRoutesCompletion"
        );
        await calculateRouteCompletion(
          {
            name: "path with neither form nor child",
            path: "/void",
            children: [],
          },
          {},
          {},
          {}
        );
        expect(routesCompletionSpy).toHaveBeenCalledTimes(1);
        expect(routesCompletionSpy).toHaveBeenCalledWith([], {}, {}, {});
      });
    });

    describe("case: standard", () => {
      test("returns undefined if no form on route", async () => {
        const result = await calculateRouteCompletion(
          {
            name: "standard page with no form",
            path: "/standard",
            pageType: PageTypes.STANDARD,
          },
          {},
          {},
          {}
        );
        expect(result).toEqual(undefined);
      });

      test("returns true if form complete", async () => {
        formCompletionSpy.mockResolvedValue(true);
        const result = await calculateRouteCompletion(
          mockStandardReportPageJson,
          {},
          {},
          {}
        );
        expect(result).toEqual({
          [mockStandardReportPageJson.path]: true,
        });
      });

      test("returns false if form incomplete", async () => {
        formCompletionSpy.mockResolvedValue(false);
        const result = await calculateRouteCompletion(
          mockStandardReportPageJson,
          {},
          {},
          {}
        );
        expect(result).toEqual({
          [mockStandardReportPageJson.path]: false,
        });
      });
    });

    describe("case: drawer", () => {
      test("returns undefined if no form on route", async () => {
        const result = await calculateRouteCompletion(
          {
            name: "drawer page with no form",
            path: "/drawer",
            pageType: PageTypes.DRAWER,
          },
          {},
          {},
          {}
        );
        expect(result).toEqual(undefined);
      });

      test("If user has not added an ILOS, they're not required to complete that section", async () => {
        const testData = {};
        const mockIlosRoute = {
          ...mockDrawerReportPageJson,
          path: "/mcpar/plan-level-indicators/ilos",
        };
        const result = await calculateRouteCompletion(
          mockIlosRoute,
          testData,
          {},
          {}
        );
        expect(result).toEqual(undefined);
      });

      test("If user is not reporting Prior Authorization (Section B) data, they're not required to complete that section", async () => {
        const testData = {
          state_priorAuthorizationReporting: [
            {
              key: "mock-key",
              value: "Not reporting data",
            },
          ],
        };
        const mockPriorAuthRoute = {
          ...mockDrawerReportPageJson,
          path: "/mcpar/state-level-indicators/prior-authorization",
        };
        const result = await calculateRouteCompletion(
          mockPriorAuthRoute,
          testData,
          {},
          {}
        );
        expect(result).toEqual(undefined);
      });

      test("If user is not reporting Prior Authorization (Section D) data, they're not required to complete that section", async () => {
        const testData = {
          plan_priorAuthorizationReporting: [
            {
              key: "mock-key",
              value: "Not reporting data",
            },
          ],
        };
        const mockPriorAuthRoute = {
          ...mockDrawerReportPageJson,
          path: "/mcpar/plan-level-indicators/prior-authorization",
        };
        const result = await calculateRouteCompletion(
          mockPriorAuthRoute,
          testData,
          {},
          {}
        );
        expect(result).toEqual(undefined);
      });

      test("If user is not reporting Patient Access API data, they're not required to complete that section", async () => {
        const testData = {
          plan_patientAccessApiReporting: [
            {
              key: "mock-key",
              value: "Not reporting data",
            },
          ],
        };
        const mockPatientAccessApiRoute = {
          ...mockDrawerReportPageJson,
          path: "/mcpar/plan-level-indicators/patient-access-api",
        };
        const result = await calculateRouteCompletion(
          mockPatientAccessApiRoute,
          testData,
          {},
          {}
        );
        expect(result).toEqual(undefined);
      });

      test("Test analysis methods custom logic", async () => {
        const testData = {
          plans: [
            {
              id: "123",
              name: "test plan",
            },
          ],
          analysisMethods: [
            {
              id: "1",
              name: "first method",
              analysis_applicable: [
                {
                  key: "a",
                  value: "no",
                },
              ],
            },
          ],
        };
        const mockAnalysisMethodsRoute = {
          ...mockDrawerReportPageJson,
          path: "/naaar/state-and-program-information/analysis-methods",
          entityType: EntityType.ANALYSIS_METHODS,
          addEntityDrawerForm: {
            id: "iamnew",
            fields: [],
          },
        };
        formCompletionSpy.mockResolvedValue(false);
        const result = await calculateRouteCompletion(
          mockAnalysisMethodsRoute,
          testData,
          {},
          {}
        );
        expect(result).toMatchObject({
          "/naaar/state-and-program-information/analysis-methods": false,
        });
      });

      test("returns true if entity complete", async () => {
        entityCompletionSpy.mockResolvedValue(true);
        const result = await calculateRouteCompletion(
          mockDrawerReportPageJson,
          {},
          {},
          {}
        );
        expect(result).toEqual({
          [mockDrawerReportPageJson.path]: true,
        });
      });

      test("returns false if entity incomplete", async () => {
        entityCompletionSpy.mockResolvedValue(false);
        const result = await calculateRouteCompletion(
          mockDrawerReportPageJson,
          {},
          {},
          {}
        );
        expect(result).toEqual({
          [mockDrawerReportPageJson.path]: false,
        });
      });
    });

    describe("case: modal drawer", () => {
      test("returns undefined if no drawerForm and no modalForm present", async () => {
        const result = await calculateRouteCompletion(
          {
            name: "modal drawer page with no forms",
            path: "/modal_drawer",
            pageType: PageTypes.MODAL_DRAWER,
          },
          {},
          {},
          {}
        );
        expect(result).toEqual(undefined);
      });

      test("returns true if entity complete", async () => {
        entityCompletionSpy.mockResolvedValue(true);
        const result = await calculateRouteCompletion(
          mockModalDrawerReportPageJson,
          {},
          {},
          {}
        );
        expect(result).toEqual({
          [mockModalDrawerReportPageJson.path]: true,
        });
      });

      test("returns false if entity incomplete", async () => {
        entityCompletionSpy.mockResolvedValue(false);
        const result = await calculateRouteCompletion(
          mockModalDrawerReportPageJson,
          {},
          {},
          {}
        );
        expect(result).toEqual({
          [mockModalDrawerReportPageJson.path]: false,
        });
      });
    });

    describe("case: modal overlay", () => {
      test("returns undefined if no modalForm and no overlayForm present", async () => {
        const result = await calculateRouteCompletion(
          {
            name: "modal overlay page with no forms",
            path: "/modal_overlay",
            pageType: PageTypes.MODAL_OVERLAY,
          },
          {},
          {},
          {}
        );
        expect(result).toEqual(undefined);
      });

      test("returns true if entity complete", async () => {
        entityCompletionSpy.mockResolvedValue(true);
        const result = await calculateRouteCompletion(
          mockModalOverlayReportPageJson,
          {},
          {},
          {}
        );
        expect(result).toEqual({
          [mockModalOverlayReportPageJson.path]: true,
        });
      });

      test("returns false if entity incomplete", async () => {
        entityCompletionSpy.mockResolvedValue(false);
        const result = await calculateRouteCompletion(
          mockModalOverlayReportPageJson,
          {},
          {},
          {}
        );
        expect(result).toEqual({
          [mockModalOverlayReportPageJson.path]: false,
        });
      });
    });

    describe("case: plan overlay", () => {
      const completePlanData = {
        plans: [
          {
            id: "mockPlanId",
            name: "Mock Plan",
            isComplete: true,
          },
        ],
      };
      const formTemplate = {
        routes: [
          {
            name: "Mock Plan Overlay Page",
            path: "/naaar/mock-plan-overlay",
            pageType: PageTypes.PLAN_OVERLAY,
            entityType: EntityType.PLANS,
            verbiage: {
              intro: {
                section: "test",
              },
              requiredMessages: {
                test: undefined,
              },
              tableHeader: "test",
              emptyDashboardText: "test",
              enterEntityDetailsButtonText: "test",
            },
          },
          {
            name: "Plan compliance",
            path: "/naaar/plan-compliance",
            pageType: PageTypes.PLAN_OVERLAY,
            entityType: EntityType.PLANS,
            verbiage: {
              intro: {
                section: "test",
              },
              requiredMessages: {
                test: undefined,
              },
              tableHeader: "test",
              emptyDashboardText: "test",
              enterEntityDetailsButtonText: "test",
            },
          },
        ],
      };
      test("planOverlay returns false for route not matching plan compliance", async () => {
        const result = await calculateRouteCompletion(
          formTemplate.routes[0],
          completePlanData,
          {},
          formTemplate
        );
        expect(result).toMatchObject({
          "/naaar/mock-plan-overlay": false,
        });
      });

      test("planOverlay returns true for route matching plan compliance and complete field data", async () => {
        const result = await calculateRouteCompletion(
          formTemplate.routes[1],
          completePlanData,
          {},
          formTemplate
        );
        expect(result).toMatchObject({
          "/naaar/plan-compliance": true,
        });
      });

      test("Test planOverlay with incomplete fieldData", async () => {
        const testData = {
          plans: [
            {
              id: "mockPlanId",
              name: "Mock Plan",
              isComplete: false,
            },
          ],
        };
        const result = await calculateRouteCompletion(
          formTemplate.routes[1],
          testData,
          {},
          formTemplate
        );
        expect(result).toMatchObject({
          "/naaar/plan-compliance": false,
        });
      });

      test("Test planOverlay with no fieldData", async () => {
        const testData = {};
        const result = await calculateRouteCompletion(
          formTemplate.routes[1],
          testData,
          {},
          formTemplate
        );
        expect(result).toMatchObject({
          "/naaar/plan-compliance": false,
        });
      });
    });

    describe("case: review and submit", () => {
      test("returns undefined for review and submit page", async () => {
        const result = await calculateRouteCompletion(
          {
            name: "review and submit",
            path: "/review_submit",
            pageType: PageTypes.REVIEW_SUBMIT,
          },
          {},
          {},
          {}
        );
        expect(result).toEqual(undefined);
      });
    });
  });

  describe("calculateRoutesCompletion()", () => {
    const routeCompletionSpy = jest.spyOn(
      completionStatus,
      "calculateRouteCompletion"
    );
    test("combines all results from route completion", async () => {
      routeCompletionSpy
        .mockResolvedValueOnce({
          "/mock/mock-route-1": true,
        })
        .mockResolvedValueOnce({
          "/mock/mock-route-2": false,
        })
        .mockResolvedValue({
          "/mock/mock-route-3": true,
        });
      const result = await calculateRoutesCompletion(
        mockReportJson.routes,
        {},
        mockReportJson.validationJson,
        mockReportJson
      );
      expect(result).toEqual({
        "/mock/mock-route-1": true,
        "/mock/mock-route-2": false,
        "/mock/mock-route-3": true,
      });
    });
  });

  describe("calculateCompletionStatus()", () => {
    const mockSectionPath = "/report/section-1";
    const mockStandardFormPath = "/report/section-1/form-1";
    const mockFormTemplate = {
      routes: [
        {
          name: "Route 1",
          path: mockSectionPath,
          children: [
            {
              name: "Form 1",
              path: mockStandardFormPath,
              pageType: "standard",
              form: { fields: [mockFormField] },
            },
          ],
        },
      ],
      validationJson: {
        [mockFormField.id]: "text",
      },
    };

    const routeCompletionSpy = jest.spyOn(
      completionStatus,
      "calculateRoutesCompletion"
    );
    beforeEach(() => {
      routeCompletionSpy.mockResolvedValue({
        [mockSectionPath]: {
          [mockStandardFormPath]: false,
        },
      });
    });
    test("returns response of calculateRoutesCompletion", async () => {
      const result = await calculateCompletionStatus({}, mockFormTemplate);
      expect(result).toEqual({
        [mockSectionPath]: {
          [mockStandardFormPath]: false,
        },
      });
      expect(routeCompletionSpy).toHaveBeenCalledWith(
        mockFormTemplate.routes,
        {},
        mockFormTemplate,
        mockFormTemplate.validationJson
      );
    });

    test("uses validationSchema when provided", async () => {
      const result = await calculateCompletionStatus({}, mockFormTemplate, {});
      expect(result).toEqual({
        [mockSectionPath]: {
          [mockStandardFormPath]: false,
        },
      });
      expect(routeCompletionSpy).toHaveBeenCalledWith(
        mockFormTemplate.routes,
        {},
        mockFormTemplate,
        {}
      );
    });
  });
});
