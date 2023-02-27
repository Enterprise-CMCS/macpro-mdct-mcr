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
        description:
          "Report is missing State Name in point of contact, otherwise complete.",
        testData: "mcpar-data-missing-pointofcontact",
        expectedResult: "mcpar-status-result-missing-pointofcontact",
        formTemplate: "mcpar-template",
      },
      {
        description: "MCPAR Report, incomplete due to missing drawer",
        testData: "mcpar-data-missing-drawer",
        expectedResult: "mcpar-status-result-missing-drawer",
        formTemplate: "mcpar-template",
      },
      {
        description: "MCPAR Report, incomplete due to missing modal",
        testData: "mcpar-data-missing-modal",
        expectedResult: "mcpar-status-result-missing-modal",
        formTemplate: "mcpar-template",
      },
    ];
    runs.forEach((run) => {
      test(run.description, async () => {
        const testData = require(`../../utils/testing/fixtures/${run.testData}.json`);
        const expectedResult = require(`../../utils/testing/fixtures/${run.expectedResult}.json`);
        const formTemplate = require(`../../utils/testing/fixtures/${run.formTemplate}.json`);
        const result = await calculateCompletionStatus(testData, formTemplate);
        expect(result).toMatchObject(expectedResult);
      });
    });
    test("Fixture Testbed", async () => {
      //TODO: Skip this when fixtures are done
      const run = {
        description: "Completed MCPAR Report",
        testData: "mcpar-data-complete",
        expectedResult: "mcpar-status-result-complete",
        formTemplate: "mcpar-template",
      };
      const testData = require(`../../utils/testing/fixtures/${run.testData}.json`);
      const expectedResult = require(`../../utils/testing/fixtures/${run.expectedResult}.json`);
      const formTemplate = require(`../../utils/testing/fixtures/${run.formTemplate}.json`);
      const result = await calculateCompletionStatus(testData, formTemplate);
      expect(result).toMatchObject(expectedResult);
    });
  });
});
