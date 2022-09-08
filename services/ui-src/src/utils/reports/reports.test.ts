import {
  copyAdminDisabledStatusToForms,
  createReportId,
  flattenReportRoutesArray,
  sortReportsOldestToNewest,
} from "./reports";

import { ReportJson } from "types";

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

describe("Sort Reports", () => {
  it("should sort reports by oldest to newest", () => {
    const unsortedReports = [
      {
        createdAt: 1662568556165,
        programName: "Second Oldest",
      },
      {
        createdAt: 1662568568589,
        programName: "Third Oldest",
      },
      {
        createdAt: 1652568576322,
        programName: "Oldest",
      },
    ];

    const sortedReports = [
      {
        createdAt: 1652568576322,
        programName: "Oldest",
      },
      {
        createdAt: 1662568556165,
        programName: "Second Oldest",
      },
      {
        createdAt: 1662568568589,
        programName: "Third Oldest",
      },
    ];

    expect(sortReportsOldestToNewest(unsortedReports)).toEqual(sortedReports);
  });
});

describe("Test copyAdminDisabledStatusToForms", () => {
  const newReportJson: ReportJson = {
    name: "mockJson",
    basePath: "/base/mockJson",
    version: "0.0.0",
    adminDisabled: true,
    routes: [
      {
        name: "mock-route-1",
        path: "/mock/mock-route-1",
        page: {
          intro: {
            section: "mock section",
            subsection: "mock subsection",
          },
        },
        form: {
          id: "mock-form-id",
          fields: {
            id: "mock-1",
            type: "text",
            props: {
              label: "mock field",
            },
          },
        },
      },
    ],
  };
  it("should be disabled for admin user", () => {
    const report = copyAdminDisabledStatusToForms(newReportJson);
    const form = report.routes[0].form;
    expect(form.adminDisabled).toBeTruthy();
  });
});
