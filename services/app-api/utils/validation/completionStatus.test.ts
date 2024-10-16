import { calculateCompletionStatus, isComplete } from "./completionStatus";

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
      expect(result).toStrictEqual({
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
      expect(result).toMatchObject({});
    });
    test("Incomplete entities does not cause an exception", async () => {
      const result = await calculateCompletionStatus(
        {},
        { entities: {}, routes: entitiesRoutes }
      );
      expect(result).toMatchObject({});
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
      expect(result).toMatchObject({});
    });

    test("If user is not reporting Prior Authorization data, they're not required to complete that section", async () => {
      const testData = {
        reportingDataPriorToJune2026: [
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
                  fields: [
                    {
                      id: "reportingDataPriorToJune2026",
                      type: "radio",
                      validation: "radio",
                      props: {
                        label: "Are you reporting data prior to June 2026?",
                        hint: 'If "Yes", please complete the following questions under each plan.',
                        choices: [
                          {
                            id: "IELJsTZxQkFDkTMzWQkKocwb",
                            label: "Not reporting data",
                          },
                          {
                            id: "bByTWRIwTSTBncyZRUiibagB",
                            label: "Yes",
                          },
                        ],
                      },
                    },
                  ],
                },
                drawerForm: {
                  id: "dpa",
                  fields: [
                    {
                      id: "D1.XIII.1Header",
                      type: "sectionHeader",
                      props: {
                        content:
                          "Total count of PA requests logged in by the plan during the prior calendar year",
                      },
                    },
                    {
                      id: "plan_totalStandardPARequests",
                      type: "number",
                      validation: "number",
                      props: {
                        label: "D1.XIII.1 Total standard PA requests",
                        hint: 'Enter the total number of standard PA requests logged by the plan during the prior calendar year. If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                      },
                    },
                    {
                      id: "plan_totalExpeditedPARequests",
                      type: "number",
                      validation: "number",
                      props: {
                        label: "D1.XIII.2 Total expedited PA requests",
                        hint: 'Enter the total number of expedited PA requests logged by the plan during the prior calendar year. If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                      },
                    },
                    {
                      id: "plan_totalStandardAndExpeditedPARequests",
                      type: "number",
                      validation: "number",
                      props: {
                        label:
                          "D1.XIII.3 Total standard and expedited PA requests",
                        hint: 'Enter the total number of standard and expedited PA requests logged by the plan during the prior calendar year. If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                      },
                    },
                    {
                      id: "D1.XIII.4Header",
                      type: "sectionHeader",
                      props: {
                        divider: "top",
                        content: "Of the total standard PA requests",
                      },
                    },
                    {
                      id: "plan_percentageOfStandardPARequestsApproved",
                      type: "number",
                      validation: "number",
                      props: {
                        label:
                          "D1.XIII.4 Percentage of standard PA requests that were approved",
                        hint: 'Enter the percentage of the total standard PA requests, as reported in D1.XIII.1, that were approved. If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                        mask: "percentage",
                      },
                    },
                    {
                      id: "plan_percentageOfStandardPARequestsDenied",
                      type: "number",
                      validation: "number",
                      props: {
                        label:
                          "D1.XIII.5 Percentage of standard PA requests that were denied",
                        hint: 'Enter the percentage of the total standard PA requests, as reported in D1.XIII.1, that were denied. If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                        mask: "percentage",
                      },
                    },
                    {
                      id: "plan_percentageOfStandardPARequestsApprovedAfterAppeal",
                      type: "number",
                      validation: "number",
                      props: {
                        label:
                          "D1.XIII.6 Percentage of standard PA requests that were approved after appeal",
                        hint: 'Enter the percentage of the total standard PA requests, as reported in D1.XIII.1, that were approved after appeal, aggregated for all items and services as defined in § 438.210(f)(4). If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                        mask: "percentage",
                      },
                    },
                    {
                      id: "plan_averageTimeToDecisionForStandardPAs",
                      type: "number",
                      validation: "number",
                      props: {
                        label:
                          "D1.XIII.7 Average time to decision for standard PAs",
                        hint: 'For standard PAs, as reported in D1.XIII.1, enter the average number of days that elapsed between submission of request and determination by the MCO, PIHP or PAHP. If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                      },
                    },
                    {
                      id: "plan_medianTimeThatElapsedForDecisionOnStandardPAs",
                      type: "number",
                      validation: "number",
                      props: {
                        label:
                          "D1.XIII.8 Median time that elapsed for decision on standard PAs",
                        hint: 'For standard PAs, as reported in D1.XIII.1, enter the median number of days that elapsed between submission of request and decision by the MCO, PIHP or PAHP. If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                      },
                    },
                    {
                      id: "D1.XIII.9Header",
                      type: "sectionHeader",
                      props: {
                        divider: "top",
                        content: "Of the total expedited PA requests",
                      },
                    },
                    {
                      id: "plan_percentageOfExpeditedPARequestsApproved",
                      type: "number",
                      validation: "number",
                      props: {
                        label:
                          "D1.XIII.9 Percentage of expedited PA requests that were approved",
                        hint: 'Of the total expedited PA requests, as reported in D1.XIII.2, enter the percentage that were approved. If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                        mask: "percentage",
                      },
                    },
                    {
                      id: "plan_percentageOfExpeditedPARequestsDenied",
                      type: "number",
                      validation: "number",
                      props: {
                        label:
                          "D1.XIII.10 Percentage of expedited PA requests that were denied",
                        hint: 'Of the total expedited PA requests, as reported in D1.XIII.2, enter the percentage that were denied. If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                        mask: "percentage",
                      },
                    },
                    {
                      id: "plan_averageTimeToDecisionForExpeditedPAs",
                      type: "number",
                      validation: "number",
                      props: {
                        label:
                          "D1.XIII.11 Average time to decision for expedited PAs",
                        hint: 'Of the total expedited PA requests, as reported in D1.XIII.2, enter the average number of hours elapsed between submission of request and decision by MCO, PIHP or PAHP. If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                      },
                    },
                    {
                      id: "plan_medianTimeThatElapsedForDecisionOnExpeditedPAs",
                      type: "number",
                      validation: "number",
                      props: {
                        label:
                          "D1.XIII.12 Median time that elapsed for decision on expedited PAs",
                        hint: 'Of the total expedited PA requests, as reported in D1.XIII.2, enter the median number of hours elapsed between submission of request and decision bt MCO, PIHP or PAHP, as defined in § 438.210(f)(9). If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                      },
                    },
                    {
                      id: "D1.XIII.13Header",
                      type: "sectionHeader",
                      props: {
                        divider: "top",
                        content: "Of total PA requests",
                      },
                    },
                    {
                      id: "plan_percentageOfTotalPARequestsApprovedWithExtendedTimeframe",
                      type: "number",
                      validation: "number",
                      props: {
                        label:
                          "D1.XIII.13 Percentage of total PA requests approved with extended timeframe",
                        hint: 'Of the total PA requests, as reported in D1.XIII.3, enter the percentage of requests for which the timeframe for review was extended and the request was approved. If you choose not to respond prior to June 2026, enter "NR" for not reporting.',
                        mask: "percentage",
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
      expect(result).toMatchObject({});
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
