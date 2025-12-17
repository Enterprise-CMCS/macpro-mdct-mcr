import { calculateCompletionStatus, isComplete } from "./completionStatus";
import { measuresAndResultsRoute } from "../../forms/routes/mcpar/flags/newQualityMeasuresSectionEnabled/plan-level-indicators/quality-measures/measures-and-results";

describe("Completion Status Tests", () => {
  describe("Test Nested Completion Check", () => {
    test("Fails if there are any false", () => {
      expect(
        isComplete({
          foo: true,
          bar: {
            baz: true,
            biz: {
              buzz: false,
            },
          },
        })
      ).toBe(false);
    });
    test("Succeeds if all true", () => {
      expect(
        isComplete({
          foo: true,
          bar: {
            baz: true,
            biz: {
              buzz: true,
            },
          },
        })
      ).toBe(true);
    });
  });
  describe("Test Completion Status of Report", () => {
    const entitiesRoutes = [
      {
        name: "A: Program Information",
        path: "/mcpar/program-information",
        children: [
          {
            name: "III: Encounter Data Report",
            path: "/mcpar/plan-level-indicators/encounter-data-report",
            pageType: "drawer",
            entityType: "plans",
            verbiage: {
              intro: {
                section: "Section D: Plan-Level Indicators",
                subsection: "Topic III. Encounter Data",
                spreadsheet: "D1_Plan_Set",
              },
              dashboardTitle: "Report on encounter data for each plan",
              drawerTitle: "Report encounter data for",
              missingEntityMessage: [
                {
                  type: "span",
                  content:
                    "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
                },
                {
                  type: "internalLink",
                  content: "Add Plans",
                  props: {
                    to: "/mcpar/program-information/add-plans",
                  },
                },
              ],
            },
            drawerForm: {
              id: "dedr",
              fields: undefined,
            },
          },
        ],
      },
    ];
    test("Basic Standard Form No Fields", async () => {
      jest.clearAllMocks();

      const testData = {};
      const formTemplate = {
        routes: [
          {
            name: "A: Program Information",
            path: "/mcpar/program-information",
            children: [
              {
                name: "Point of Contact",
                path: "/mcpar/program-information/point-of-contact",
                pageType: "standard",
                form: { fields: [] },
              },
            ],
          },
        ],
      };
      const result = await calculateCompletionStatus(testData, formTemplate);
      expect(result).toMatchObject({
        "/mcpar/program-information": {
          "/mcpar/program-information/point-of-contact": false,
        },
      });
    });

    test("Basic Standard Form With Fields", async () => {
      jest.clearAllMocks();

      const testData = {};
      const formTemplate = {
        routes: [
          {
            name: "A: Program Information",
            path: "/mcpar/program-information",
            children: [
              {
                name: "Point of Contact",
                path: "/mcpar/program-information/point-of-contact",
                pageType: "standard",
                form: {
                  fields: [
                    {
                      id: "stateName",
                      type: "text",
                      validation: "text",
                      props: {
                        label: "A.1 State name",
                        hint: "Auto-populated from your account profile.",
                        disabled: true,
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      };
      const result = await calculateCompletionStatus(testData, formTemplate);
      expect(result).toStrictEqual({
        "/mcpar/program-information": {
          "/mcpar/program-information/point-of-contact": false,
        },
      });
    });

    test("Null routes does not cause an exception", async () => {
      const result = await calculateCompletionStatus({}, {});
      expect(result).toMatchObject({});
    });

    test("Missing entities does not cause an exception", async () => {
      const result = await calculateCompletionStatus(
        {},
        { routes: entitiesRoutes }
      );
      expect(result).toMatchObject({
        "/mcpar/program-information": {
          "/mcpar/plan-level-indicators/encounter-data-report": undefined,
        },
      });
    });
    test("Incomplete entities does not cause an exception", async () => {
      const result = await calculateCompletionStatus(
        {},
        { entities: {}, routes: entitiesRoutes }
      );
      expect(result).toMatchObject({
        "/mcpar/program-information": {
          "/mcpar/plan-level-indicators/encounter-data-report": true,
        },
      });
    });

    test("Missing nested fields does not cause an exception", async () => {
      const result = await calculateCompletionStatus(
        {
          plans: [
            {
              id: "cd432-070f-0b5b-4cfb-73c12e6f45",
              name: "Dynamic Fill",
            },
          ],
        },
        { entities: { plans: { required: true } }, routes: entitiesRoutes }
      );
      expect(result).toMatchObject({
        "/mcpar/program-information": {
          "/mcpar/plan-level-indicators/encounter-data-report": false,
        },
      });
    });

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
  });

  describe("pageType: drawer", () => {
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

  describe("pageType: planOverlay", () => {
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

  describe("pageType: modalOverlay", () => {
    describe("Measures and results page", () => {
      const qualityMeasures = [
        {
          id: "mockMeasureId",
          measure_name: "Mock measure name",
          measure_identifier: [
            {
              key: "measure_identifier-mock",
              value: "Yes",
            },
          ],
          measure_identifierCmit: "12345",
          measure_dataVersion: [
            {
              key: "measure_dataVersion-mock",
              value: "Mock",
            },
          ],
          measure_activities: [
            {
              key: "measure_activities-mock",
              value: "Mock",
            },
          ],
          measure_dataCollectionMethod: [
            {
              key: "measure_dataCollectionMethod-mock",
              value: "Mock",
            },
          ],
          measure_rates: [
            {
              id: "mockRateId",
              name: "Mock rate",
            },
          ],
        },
      ];

      test("with complete fieldData", async () => {
        const testData = {
          plans: [
            {
              id: "mockPlanId",
              measures: {
                mockMeasureId: {
                  measure_dataCollectionMethod: [
                    {
                      key: "measure_dataCollectionMethod-mock",
                      value: "Mock",
                    },
                  ],
                  measure_isNotReportingReason: [
                    {
                      key: "measure_isNotReportingReason-mock",
                      value: "No",
                    },
                  ],
                  "measure_isNotReportingReason-otherText": "",
                  measure_isReporting: [
                    {
                      key: "measure_isReporting-mock",
                      value: "Not reporting",
                    },
                  ],
                  "measure_rateResults-mockRateId": "12345",
                },
              },
            },
          ],
          qualityMeasures,
        };
        const formTemplate = {
          routes: [
            {
              name: "Mock Modal Overlay Page",
              path: "/mcpar/mock-modal-overlay",
              pageType: "modalOverlay",
              entityType: "qualityMeasures",
            },
            {
              name: "Measures and results",
              path: "/mcpar/plan-level-indicators/quality-measures/measures-and-results",
              pageType: "modalOverlay",
              entityType: "qualityMeasures",
              drawerForm: measuresAndResultsRoute.drawerForm,
            },
          ],
        };
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject({
          "/mcpar/mock-modal-overlay": false,
          "/mcpar/plan-level-indicators/quality-measures/measures-and-results":
            true,
        });
      });

      test("with no reporting plan measures", async () => {
        const testData = {
          plans: [
            {
              id: "mockPlanId",
              measures: {
                mockMeasureId: {
                  measure_dataCollectionMethod: [
                    {
                      key: "measure_dataCollectionMethod-mock",
                      value: "Mock",
                    },
                  ],
                  "measure_rateResults-mockRateId": "12345",
                },
              },
            },
          ],
          qualityMeasures,
        };
        const formTemplate = {
          routes: [
            {
              name: "Measures and results",
              path: "/mcpar/plan-level-indicators/quality-measures/measures-and-results",
              pageType: "modalOverlay",
              entityType: "qualityMeasures",
              drawerForm: measuresAndResultsRoute.drawerForm,
            },
          ],
        };
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject({
          "/mcpar/plan-level-indicators/quality-measures/measures-and-results":
            true,
        });
      });

      test("with no plan measures", async () => {
        const testData = {
          plans: [
            {
              id: "mockPlanId",
            },
          ],
          qualityMeasures,
        };
        const formTemplate = {
          routes: [
            {
              name: "Measures and results",
              path: "/mcpar/plan-level-indicators/quality-measures/measures-and-results",
              pageType: "modalOverlay",
              entityType: "qualityMeasures",
              drawerForm: measuresAndResultsRoute.drawerForm,
            },
          ],
        };
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject({
          "/mcpar/plan-level-indicators/quality-measures/measures-and-results":
            false,
        });
      });

      test("with no fieldData", async () => {
        const testData = {};
        const formTemplate = {
          routes: [
            {
              name: "Measures and results",
              path: "/mcpar/plan-level-indicators/quality-measures/measures-and-results",
              pageType: "modalOverlay",
              entityType: "qualityMeasures",
              drawerForm: measuresAndResultsRoute.drawerForm,
            },
          ],
        };
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject({
          "/mcpar/plan-level-indicators/quality-measures/measures-and-results":
            false,
        });
      });
    });
  });

  describe("Fixture Testing", () => {
    const runs = [
      {
        description: "Completed MCPAR Report",
        fixture: "mcpar-complete",
        formTemplate: "mcpar-template",
      },
      {
        description: "New Incomplete MCPAR Report",
        fixture: "mcpar-incomplete",
        formTemplate: "mcpar-template",
      },
      {
        description: "Missing nested field",
        fixture: "mcpar-incomplete-nested",
        formTemplate: "mcpar-template",
      },
      {
        description: "Empty Checkbox",
        fixture: "mcpar-incomplete-empty-checkbox",
        formTemplate: "mcpar-template",
      },
      {
        description:
          "Report is missing State Name in point of contact, otherwise complete.",
        fixture: "mcpar-missing-pointofcontact",
        formTemplate: "mcpar-template",
      },
      {
        description: "MCPAR Report, incomplete due to missing drawer",
        fixture: "mcpar-missing-drawer",
        formTemplate: "mcpar-template",
      },
      {
        description: "MCPAR Report, incomplete due to missing modal",
        fixture: "mcpar-missing-modal",
        formTemplate: "mcpar-template",
      },
      {
        description: "Completed MCPAR Report with no Sanction",
        fixture: "mcpar-complete-nosanctions",
        formTemplate: "mcpar-template",
      },
      {
        description: "Incomplete MCPAR Report due to partial sanction",
        fixture: "mcpar-incomplete-partialsanction",
        formTemplate: "mcpar-template",
      },
      {
        description: "Incomplete MCPAR Report due to plan with no entities",
        fixture: "mcpar-incomplete-plan-noentities",
        formTemplate: "mcpar-template",
      },
      {
        description: "Completed MCPAR but not submitted",
        fixture: "mcpar-complete-unsubmitted",
        formTemplate: "mcpar-template",
      },
      {
        description: "Completed MLR with no remittance",
        fixture: "mlr-complete-no-remittance",
        formTemplate: "mlr-template",
      },
      {
        description: "Completed MLR with remittance",
        fixture: "mlr-complete-with-remittance",
        formTemplate: "mlr-template",
      },
      {
        description: "MLR with no programs",
        fixture: "mlr-missing-reports",
        formTemplate: "mlr-template",
      },
    ];
    runs.forEach((run) => {
      test(run.description, async () => {
        const testData = require(`../../utils/testing/fixtures/completionStatus/${run.fixture}.testdata.test.json`);
        const expectedResult = require(`../../utils/testing/fixtures/completionStatus/${run.fixture}.result.test.json`);
        const formTemplate = require(`../../utils/testing/fixtures/completionStatus/${run.formTemplate}.test.json`);
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject(expectedResult);
      });
    });
  });

  describe("Local Fixture Testing, not used in CI", () => {
    const runs = [
      {
        description: "Completed MCPAR but not submitted",
        fixture: "mcpar-complete-unsubmitted",
        formTemplate: "mcpar-template",
      },
    ];
    runs.forEach((run) => {
      test(run.description, async () => {
        const testData = require(`../../utils/testing/fixtures/completionStatus/${run.fixture}.testdata.test.json`);
        const expectedResult = require(`../../utils/testing/fixtures/completionStatus/${run.fixture}.result.test.json`);
        const formTemplate = require(`../../utils/testing/fixtures/completionStatus/${run.formTemplate}.test.json`);
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject(expectedResult);
      });
    });
  });
});
