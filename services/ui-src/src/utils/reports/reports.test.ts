import { ReportJson } from "types";
import {
  flattenReportRoutesArray,
  sortReportsOldestToNewest,
  copyAdminDisabledStatusToForms,
  makeFieldIdList,
} from "./reports";
import {
  mockFlattenedReportRoutes,
  mockFormField,
  mockNestedFormField,
  mockPageJson,
  mockReportRoutes,
  mockReport,
} from "utils/testing/setupJest";

describe("Test flattenReportRoutesArray", () => {
  it("Should flatten report routes", () => {
    const expectedResult = mockFlattenedReportRoutes;
    const result = flattenReportRoutesArray(mockReportRoutes);
    expect(result).toEqual(expectedResult);
  });
});

describe("Test sortReportsOldestToNewest", () => {
  it("Should sort reports by oldest to newest", () => {
    const unsortedReports = [
      {
        ...mockReport,
        createdAt: 1662568568589,
        programName: "created-today",
      },
      {
        ...mockReport,
        createdAt: 1662568556165,
        programName: "created-yesterday",
      },
      {
        ...mockReport,
        createdAt: 1652568576322,
        programName: "created-last-month",
      },
    ];
    const sortedReports = [
      unsortedReports[2],
      unsortedReports[1],
      unsortedReports[0],
    ];
    expect(sortReportsOldestToNewest(unsortedReports)).toEqual(sortedReports);
  });
});

describe("Test copyAdminDisabledStatusToForms", () => {
  const newReportJson: ReportJson = {
    name: "mockJson",
    basePath: "/base/mockJson",
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

const mockField1 = { ...mockFormField, id: "mock-1" };
const mockField2 = { ...mockNestedFormField, id: "mock-2" };
const mockField3 = { ...mockFormField, id: "mock-3" };

const mockFlatRoutes = [
  {
    name: "mock-route-1",
    path: "/mock/mock-route-1",
    page: mockPageJson,
    form: {
      id: "mock-form-id-1",
      fields: [mockField1],
    },
  },
  {
    name: "mock-route-2",
    path: "/mock/mock-route-2",
    page: mockPageJson,
    form: {
      id: "mock-form-id-2",
      fields: [mockField2, mockField3],
    },
  },
];

const expectedResult = {
  "mock-1": "mock text field",
  "mock-2": "mock radio field",
  "mock-text-field": "mock text field",
  "mock-3": "mock text field",
};

describe("Test makeFieldIdList", () => {
  test("Creates flat object of fieldIds when passed nested fields", () => {
    const result = makeFieldIdList(mockFlatRoutes);
    expect(result).toEqual(expectedResult);
  });
});
