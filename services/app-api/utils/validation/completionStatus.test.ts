import { calculateCompletionStatus } from "./completionStatus";

describe("Statusing Tests", () => {
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
        formTemplate.routes,
        null
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
        formTemplate.routes,
        null
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
        testData: "mcpar-data-complete",
        expectedResult: "mcpar-status-result-complete",
        formTemplate: "mcpar-template",
      },
      {
        description: "New Incomplete MCPAR Report",
        testData: "mcpar-data-incomplete",
        expectedResult: "mcpar-status-result-incomplete",
        formTemplate: "mcpar-template",
      },
      {
        description: "New MCPAR Report With Incomplete Drawer",
        testData: "mcpar-data-incomplete",
        expectedResult: "mcpar-status-result-incomplete",
        formTemplate: "mcpar-template",
      },
      {
        description: "MCPAR Report With 2 Plans, 1 complete and 1 incomplete",
        testData: "mcpar-data-2plans-incomplete",
        expectedResult: "mcpar-status-result-2plans-incomplete",
        formTemplate: "mcpar-template",
      },
      {
        description: "New Incomplete MCPAR Report", //TODO: This doesn't look right
        testData: "mcpar-data-complete",
        expectedResult: "mcpar-data-partially-complete",
        formTemplate: "mcpar-template",
      },
    ];
    runs.forEach((run) => {
      test(run.description, async () => {
        const testData = require(`../../utils/testing/fixtures/${run.testData}.json`);
        const expectedResult = require(`../../utils/testing/fixtures/${run.expectedResult}.json`);
        const formTemplate = require(`../../utils/testing/fixtures/${run.formTemplate}.json`);
        const result = await calculateCompletionStatus(
          testData,
          formTemplate.routes,
          formTemplate.validationJson
        );
        expect(result).toMatchObject(expectedResult);
      });
    });
    test("Fixture Testbed", async () => {
      //TODO: Skip this when fixtures are done
      const run = {
        description: "New Incomplete MCPAR Report",
        testData: "mcpar-data-incomplete",
        expectedResult: "mcpar-status-result-incomplete",
        formTemplate: "mcpar-template",
      };
      const testData = require(`../../utils/testing/fixtures/${run.testData}.json`);
      const expectedResult = require(`../../utils/testing/fixtures/${run.expectedResult}.json`);
      const formTemplate = require(`../../utils/testing/fixtures/${run.formTemplate}.json`);
      const result = await calculateCompletionStatus(
        testData,
        formTemplate.routes,
        formTemplate.validationJson
      );
      expect(result).toMatchObject(expectedResult);
    });
  });
});
