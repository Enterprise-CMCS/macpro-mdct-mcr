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
  mockReportRoutes,
  mockReport,
  mockStandardReportPageJson,
  mockReportJson,
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
  it("should copy disabled status to all form types", () => {
    const mockAdminDisabledReportJson = {
      ...mockReportJson,
      adminDisabled: true,
    };
    const output = copyAdminDisabledStatusToForms(mockAdminDisabledReportJson);

    const testStandardPageForm = output.routes[0].form;
    const testEntityDrawerPageForm = output.routes[1].children![0].drawer!.form;
    const testDynamicDrawerPageModalForm =
      output.routes[1].children![1].modal!.form;
    const testDynamicDrawerPageDrawerForm =
      output.routes[1].children![1].drawer!.form;

    expect(testStandardPageForm!.adminDisabled).toBeTruthy();
    expect(testEntityDrawerPageForm!.adminDisabled).toBeTruthy();
    expect(testDynamicDrawerPageModalForm!.adminDisabled).toBeTruthy();
    expect(testDynamicDrawerPageDrawerForm!.adminDisabled).toBeTruthy();
  });
});

const mockField1 = { ...mockFormField, id: "mock-1" };
const mockField2 = { ...mockNestedFormField, id: "mock-2" };
const mockField3 = { ...mockFormField, id: "mock-3" };

const mockFlatRoutes = [
  {
    ...mockStandardReportPageJson,
    name: "mock-route-1",
    path: "/mock/mock-route-1",
    form: {
      id: "mock-form-id-1",
      fields: [mockField1],
    },
  },
  {
    ...mockStandardReportPageJson,
    name: "mock-route-2",
    path: "/mock/mock-route-2",
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
