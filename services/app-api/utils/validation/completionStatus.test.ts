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
              adminDisabled: true,
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
        description: "Nested Empty Checkbox",
        fixture: "mcpar-incomplete-nested-empty-checkbox",
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
