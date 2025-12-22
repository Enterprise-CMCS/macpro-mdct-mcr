import { mockFormField, mockNestedFormField } from "../testing/mocks/mockForm";
import { calculateCompletionStatus, isComplete } from "./completionStatus";

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

  describe("calculateCompletionStatus()", () => {
    const mockSectionPath = "/report/section-1";
    const mockStandardFormPath = "/report/section-1/form-1";
    const mockFieldData = {
      [mockFormField.id]: "answer 1",
    };
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
            {
              name: "No form 1",
              path: `${mockSectionPath}/no-form`,
              pageType: "standard",
            },
          ],
        },
      ],
      validationJson: {
        [mockFormField.id]: "text",
      },
    };
    describe("basic functionality", () => {
      test("routes with no form don't return a status and forms with no field data return false", async () => {
        const result = await calculateCompletionStatus({}, mockFormTemplate);
        expect(result).toEqual({
          [mockSectionPath]: {
            [mockStandardFormPath]: false,
          },
        });
      });

      test("form routes with valid field data return true", async () => {
        const result = await calculateCompletionStatus(
          mockFieldData,
          mockFormTemplate
        );
        expect(result).toEqual({
          [mockSectionPath]: {
            [mockStandardFormPath]: true,
          },
        });
      });

      test("Null routes does not cause an exception", async () => {
        const result = await calculateCompletionStatus({}, {});
        expect(result).toMatchObject({});
      });
    });

    describe("with entities", () => {
      const mockEntityRoutes = [
        {
          name: "Route 1",
          path: mockSectionPath,
          children: [
            {
              name: "Form 1",
              path: mockStandardFormPath,
              pageType: "drawer",
              entityType: "mockEntity",
              drawerForm: { id: "mock-form", fields: [mockNestedFormField] },
            },
          ],
        },
      ];

      test("Missing entities returns undefined", async () => {
        const result = await calculateCompletionStatus(
          {},
          { routes: mockEntityRoutes }
        );
        expect(result).toMatchObject({
          [mockSectionPath]: {
            [mockStandardFormPath]: undefined,
          },
        });
      });
      test("Incomplete entities returns true", async () => {
        const result = await calculateCompletionStatus(
          {},
          { entities: {}, routes: mockEntityRoutes }
        );
        expect(result).toMatchObject({
          [mockSectionPath]: {
            [mockStandardFormPath]: true,
          },
        });
      });

      test("Missing nested fields returns false", async () => {
        const result = await calculateCompletionStatus(
          {
            mockEntity: [
              {
                id: "cd432-070f-0b5b-4cfb-73c12e6f45",
                name: "Dynamic Fill",
              },
            ],
          },
          {
            entities: { mockEntity: { required: true } },
            routes: mockEntityRoutes,
          }
        );
        expect(result).toMatchObject({
          [mockSectionPath]: {
            [mockStandardFormPath]: false,
          },
        });
      });
    });

    describe("special cases", () => {
      test("If user has not added an ILOS, they're not required to complete that section", async () => {
        const testData = {};
        const formTemplate = {
          routes: [
            {
              name: "D: Plan-Level Indicators",
              path: "/mcpar/plan-level-indicators",
              children: [
                {
                  name: "ILOS",
                  path: "/mcpar/plan-level-indicators/ilos",
                  entityType: "plans",
                  pageType: "drawer",
                  drawerForm: {
                    id: "dpa",
                    fields: [],
                  },
                },
              ],
            },
          ],
        };
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject({
          "/mcpar/plan-level-indicators": {},
        });
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
        const formTemplate = {
          routes: [
            {
              name: "B: State-Level Indicators",
              path: "/mcpar/state-level-indicators",
              children: [
                {
                  name: "Prior Authorization",
                  path: "/mcpar/state-level-indicators/prior-authorization",
                  pageType: "standard",
                  form: {
                    id: "bpi",
                    fields: [],
                  },
                },
              ],
            },
          ],
        };
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject({
          "/mcpar/state-level-indicators": {
            "/mcpar/state-level-indicators/prior-authorization": false,
          },
        });
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
        const formTemplate = {
          routes: [
            {
              name: "D: Plan-Level Indicators",
              path: "/mcpar/plan-level-indicators",
              children: [
                {
                  name: "Prior Authorization",
                  path: "/mcpar/plan-level-indicators/prior-authorization",
                  entityType: "plans",
                  pageType: "drawer",
                  form: {
                    id: "pa",
                    fields: [],
                  },
                  drawerForm: {
                    id: "dpa",
                    fields: [],
                  },
                },
              ],
            },
          ],
        };
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject({
          "/mcpar/plan-level-indicators": {},
        });
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
        const formTemplate = {
          routes: [
            {
              name: "D: Plan-Level Indicators",
              path: "/mcpar/plan-level-indicators",
              children: [
                {
                  name: "Prior Authorization",
                  path: "/mcpar/plan-level-indicators/patient-access-api",
                  entityType: "plans",
                  pageType: "drawer",
                  form: {
                    id: "paa",
                    fields: [],
                  },
                  drawerForm: {
                    id: "dpaa",
                    fields: [],
                  },
                },
              ],
            },
          ],
        };
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject({
          "/mcpar/plan-level-indicators": {},
        });
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
        const formTemplate = {
          routes: [
            {
              name: "I. State and program information",
              path: "/naaar/state-and-program-information",
              children: [
                {
                  name: "Analysis methods",
                  path: "/naaar/state-and-program-information/analysis-methods",
                  entityType: "analysisMethods",
                  pageType: "drawer",
                  drawerForm: {
                    id: "iam",
                    fields: [],
                  },
                  addEntityDrawerForm: {
                    id: "iamnew",
                    fields: [],
                  },
                },
              ],
            },
          ],
        };
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject({
          "/naaar/state-and-program-information": {
            "/naaar/state-and-program-information/analysis-methods": false,
          },
        });
      });
    });

    describe("planOverlay", () => {
      test("Test planOverlay with complete fieldData", async () => {
        const testData = {
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
              pageType: "planOverlay",
              entityType: "plans",
            },
            {
              name: "Plan compliance",
              path: "/naaar/plan-compliance",
              pageType: "planOverlay",
              entityType: "plans",
            },
          ],
        };
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject({
          "/naaar/mock-plan-overlay": false,
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
        const formTemplate = {
          routes: [
            {
              name: "Plan compliance",
              path: "/naaar/plan-compliance",
              pageType: "planOverlay",
              entityType: "plans",
            },
          ],
        };
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject({
          "/naaar/plan-compliance": false,
        });
      });

      test("Test planOverlay with no fieldData", async () => {
        const testData = {};
        const formTemplate = {
          routes: [
            {
              name: "Plan compliance",
              path: "/naaar/plan-compliance",
              pageType: "planOverlay",
              entityType: "plans",
            },
          ],
        };
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject({
          "/naaar/plan-compliance": false,
        });
      });
    });
  });
});
