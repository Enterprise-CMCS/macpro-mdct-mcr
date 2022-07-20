import { addDataToReportStructure, makeRouteArray } from "./reports";

const mockReportStructure = [
  {
    name: "mock1",
    formId: "mockId1",
    path: "/base/mock1",
  },
  {
    name: "mock2",
    path: "/base/mock2",
    children: [
      {
        name: "mock2a",
        formId: "mockId2a",
        path: "/base/mock2/mock2a",
      },
      {
        name: "mock2b",
        path: "/base/mock2/mock2b",
        children: [
          {
            name: "mock2bi",
            formId: "mockId2bi",
            path: "/base/mock2/mock2b/mock2bi",
          },
        ],
      },
    ],
  },
];

const mockCombinedForms = [
  {
    path: "/base/mock1",
    form: {
      id: "mockId1",
    },
  },
  {
    path: "/base/mock2/mock2a",
    form: {
      id: "mockId2a",
    },
  },
  {
    path: "/base/mock2/mock2b/mock2bi",
    form: {
      id: "mockId2bi",
    },
  },
];

describe("Test addDataToReportStructure", () => {
  const mockExpectedResult = [
    {
      name: "mock1",
      formId: "mockId1",
      path: "/base/mock1",
      pageJson: mockCombinedForms[0],
    },
    {
      name: "mock2",
      path: "/base/mock2",
      children: [
        {
          name: "mock2a",
          formId: "mockId2a",
          path: "/base/mock2/mock2a",
          pageJson: mockCombinedForms[1],
        },
        {
          name: "mock2b",
          path: "/base/mock2/mock2b",
          children: [
            {
              name: "mock2bi",
              formId: "mockId2bi",
              path: "/base/mock2/mock2b/mock2bi",
              pageJson: mockCombinedForms[2],
            },
          ],
        },
      ],
    },
  ];
  it("Correctly populates structure with page/form data", () => {
    const result = addDataToReportStructure(
      mockReportStructure,
      mockCombinedForms
    );
    expect(result).toEqual(mockExpectedResult);
  });
});

describe("Test makeRouteArray", () => {
  const mockExpectedResult = [
    {
      name: "mock1",
      formId: "mockId1",
      path: "/base/mock1",
      pageJson: mockCombinedForms[0],
    },
    {
      name: "mock2a",
      formId: "mockId2a",
      path: "/base/mock2/mock2a",
      pageJson: mockCombinedForms[1],
    },
    {
      name: "mock2bi",
      formId: "mockId2bi",
      path: "/base/mock2/mock2b/mock2bi",
      pageJson: mockCombinedForms[2],
    },
  ];
  it("makeRouteArray", () => {
    const mockStructureWithData = addDataToReportStructure(
      mockReportStructure,
      mockCombinedForms
    );
    const result = makeRouteArray(mockStructureWithData);
    expect(result).toEqual(mockExpectedResult);
  });
});
