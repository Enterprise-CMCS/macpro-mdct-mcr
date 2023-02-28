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
      const result = await calculateCompletionStatus(
        testData,
        formTemplate
      );
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
      const result = await calculateCompletionStatus(
        testData,
        formTemplate
      );
      expect(result).toStrictEqual({
        "/mcpar/program-information": {
          "/mcpar/program-information/point-of-contact": false,
        },
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
        const testData = require(`../../utils/testing/fixtures/completionStatus/${run.fixture}.testdata.json`);
        const expectedResult = require(`../../utils/testing/fixtures/completionStatus/${run.fixture}.result.json`);
        const formTemplate = require(`../../utils/testing/fixtures/completionStatus/${run.formTemplate}.json`);
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject(expectedResult);
      });
    });
  });
  test.skip("Fixture Testbed", async () => {
    //TODO: Skip this when fixtures are done
    const run = {
      description: "Incomplete MCPAR Report due to plan with no entities",
      fixture: "mcpar-incomplete-plan-noentities",
      formTemplate: "mcpar-template",
    };
    const testData = require(`../../utils/testing/fixtures/completionStatus/${run.fixture}.testdata.json`);
    const expectedResult = require(`../../utils/testing/fixtures/completionStatus/${run.fixture}.result.json`);
    const formTemplate = require(`../../utils/testing/fixtures/completionStatus/${run.formTemplate}.json`);
    const result = await calculateCompletionStatus(testData, formTemplate);
    expect(result).toMatchObject(expectedResult);
  });
});
