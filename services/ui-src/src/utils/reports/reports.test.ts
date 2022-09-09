import {
  copyAdminDisabledStatusToForms,
  flattenReportRoutesArray,
  sortReportsOldestToNewest,
} from "./reports";

import { mockReportJson } from "utils/testing/setupJest";

const mockFormField = {
  id: "mockId",
  type: "mockType",
};

const mockReportJsonData = [
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
    const result = flattenReportRoutesArray(mockReportJsonData);
    expect(result).toEqual(mockExpectedResult);
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
  it("should be disabled for admin user", () => {
    const report = copyAdminDisabledStatusToForms(mockReportJson);
    const form = report.routes[0].form;
    expect(form.adminDisabled).toBeTruthy();
  });
});
