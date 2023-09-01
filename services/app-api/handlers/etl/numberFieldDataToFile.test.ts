import { exportNumericData } from "./numberFieldDataToFile";

jest.mock("../../utils/constants/constants", () => ({
  ...jest.requireActual("../../utils/constants/constants"),
  formTemplateTableName: "local-form-template-versions",
  reportTables: {
    MCPAR: "local-mcpar-reports",
    MLR: "local-mlr-reports",
    NAAAR: "local-naaar-reports",
  },
  reportBuckets: {
    MCPAR: "database-local-mcpar",
  },
}));

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  scanIterator: jest.fn().mockImplementation((params) => {
    switch (params.TableName) {
      case "local-form-template-versions":
        return [
          {
            reportType: "MCPAR",
            id: "template1",
          },
        ];
      case "local-mcpar-reports":
        return [
          {
            id: "report1",
            reportType: "MCPAR",
            state: "CO",
            formTemplateId: "template1",
            fieldDataId: "data1",
          },
        ];
      case "local-mlr-reports":
      case "local-naaar-reports":
        return [];
      default:
        throw new Error(
          `Cannot scan table '${params.TableName}': it has not been mocked`
        );
    }
  }),
}));

jest.mock("../../utils/s3/s3-lib", () => ({
  ...jest.requireActual("../../utils/s3/s3-lib"),
  get: jest.fn().mockImplementation((params) => {
    switch (params.Key) {
      case "formTemplates/template1.json":
        return mockFormTemplate;
      case "fieldData/CO/data1.json":
        return mockReport;
      default:
        throw new Error(
          `Cannot get object '${params.Key}': it has not been mocked`
        );
    }
  }),
}));

const mockFormTemplate = {
  routes: [
    {
      children: [
        {
          form: {
            fields: [
              {
                id: "q0",
                type: "number",
              },
              {
                id: "q1",
                type: "number",
              },
              {
                id: "q2",
                type: "choosy-list",
                choices: [
                  {
                    children: [
                      {
                        id: "q3",
                        type: "number",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          entityType: "foos",
          modalForm: {
            fields: [
              {
                id: "q4",
                type: "proppy-list",
                props: {
                  choices: [
                    {
                      children: [
                        {
                          id: "q5",
                          type: "number",
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  ],
};

const mockReport = {
  q0: "123.4", // good
  q1: "$1000", // fixable
  q3: "N/A", // good
  foos: [
    {
      q5: "i ate 5 eggs", // bad
    },
    {
      q5: "5 :1", // fixable
    },
    {
      q5: "5%", // fixable
    },
    {
      q5: " 5 ", // fixable
    },
    {
      q5: "5,555", // fixable
    },
    {
      q5: ".5", // fixable
    },
    {
      q5: "", // good
    },
    {
      q5: "5,0000", // bad
    },
  ],
};

describe("Numeric data export", () => {
  it("should extract all malformed numeric data", async () => {
    const response = await exportNumericData();
    const result = JSON.parse(response.body);

    expect(result.length).toBe(1);
    expect(result[0].report.id).toBe("report1");

    const problemFields = result[0].fields;
    const expectedFields = [
      { value: "$1000", level: "fixable", index: 0, entityType: undefined },
      { value: "i ate 5 eggs", level: "bad", index: 0, entityType: "foos" },
      { value: "5 :1", level: "fixable", index: 1, entityType: "foos" },
      { value: "5%", level: "fixable", index: 2, entityType: "foos" },
      { value: " 5 ", level: "fixable", index: 3, entityType: "foos" },
      { value: "5,555", level: "fixable", index: 4, entityType: "foos" },
      { value: ".5", level: "fixable", index: 5, entityType: "foos" },
      // Note the missing index 6 here; that value does not need fixing
      { value: "5,0000", level: "bad", index: 7, entityType: "foos" },
    ];

    for (let i = 0; i < expectedFields.length; i += 1) {
      const expected = expectedFields[i];
      const actual = problemFields[i];
      expect(actual.value).toBe(expected.value);
      expect(actual.level).toBe(expected.level);
      expect(actual.index).toBe(expected.index);
      expect(actual.entityType).toBe(expected.entityType);
    }
  });
});
