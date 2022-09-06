import { createReportId, flattenReportRoutesArray } from "./reports";

const mockFormField = {
  id: "mockId",
  type: "mockType",
};

const mockReportJson = [
  {
    name: "mock1",
    path: "/base/mock1",
    form: {
      id: "mockId1",
      fields: [mockFormField],
    },
  },
  {
    name: "mock2",
    path: "/base/mock2",
    children: [
      {
        name: "mock2a",
        path: "/base/mock2/mock2a",
        form: {
          id: "mockId2a",
          fields: [mockFormField],
        },
      },
      {
        name: "mock2b",
        path: "/base/mock2/mock2b",
        children: [
          {
            name: "mock2bi",
            path: "/base/mock2/mock2b/mock2bi",
            form: {
              id: "mockId2bi",
              fields: [mockFormField],
            },
          },
        ],
      },
    ],
  },
];

describe("Test flattenReportRoutesArray", () => {
  const mockExpectedResult: any = [
    {
      name: "mock1",
      path: "/base/mock1",
      form: {
        id: "mockId1",
        fields: [mockFormField],
      },
    },
    {
      name: "mock2a",
      path: "/base/mock2/mock2a",
      form: {
        id: "mockId2a",
        fields: [mockFormField],
      },
    },
    {
      name: "mock2bi",
      path: "/base/mock2/mock2b/mock2bi",
      form: {
        id: "mockId2bi",
        fields: [mockFormField],
      },
    },
  ];
  it("flattenReportRoutesArray", () => {
    const result = flattenReportRoutesArray(mockReportJson);
    expect(result).toEqual(mockExpectedResult);
  });
});

describe("Test createReportId", () => {
  test("createReportId correctly creates a reportId", () => {
    const mockState = "AB";
    const mockProgramName = "Program Number 1";
    const mockDueDate = 1661894735910;
    const result = createReportId(mockState, mockProgramName, mockDueDate);
    expect(result).toEqual("AB_Program-Number-1_8-30-2022");
  });
});
