import {
  flattenReportRoutesArray,
  sortReportsOldestToNewest,
  makeFieldIdList,
} from "./reports";
import {
  mockFlattenedReportRoutes,
  mockFormField,
  mockNestedFormField,
  mockReportRoutes,
  mockMcparReport,
  mockStandardReportPageJson,
  mockModalDrawerReportPageJson,
  mockDrawerReportPageJson,
  mockDrawerFormField,
  mockModalFormField,
} from "utils/testing/setupTests";
import { describe, expect, it, test } from "vitest";

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
        ...mockMcparReport,
        createdAt: 1662568568589,
        programName: "created-today",
      },
      {
        ...mockMcparReport,
        createdAt: 1662568556165,
        programName: "created-yesterday",
      },
      {
        ...mockMcparReport,
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

describe("Test makeFieldIdList", () => {
  const mockField1 = { ...mockFormField, id: "mock-standard-1" };
  const mockField2 = { ...mockNestedFormField, id: "mock-drawer-1" };
  const mockField3 = { ...mockDrawerFormField, id: "mock-drawer-2" };
  const mockField4 = {
    ...mockModalFormField,
    id: "mock-dynamic-drawer-modal-1",
  };
  const mockField5 = { ...mockDrawerFormField, id: "mock-dynamic-drawer-1" };

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
      ...mockDrawerReportPageJson,
      name: "mock-route-2",
      path: "/mock/mock-route-2",
      drawerForm: {
        id: "mock-form-id-2",
        fields: [mockField2, mockField3],
      },
    },
    {
      ...mockModalDrawerReportPageJson,
      name: "mock-route-3",
      path: "/mock/mock-route-3",
      modalForm: {
        id: "mock-form-id-3",
        fields: [mockField4],
      },
      drawerForm: {
        id: "mock-form-id-4",
        fields: [mockField5],
      },
    },
  ];

  test("Creates flat object of fieldIds when passed nested fields", () => {
    const result = makeFieldIdList(mockFlatRoutes);
    expect(result).toEqual({
      "mock-dynamic-drawer-1": "mock drawer text field",
      "mock-dynamic-drawer-modal-1": "mock modal text field",
      "mock-drawer-1": "mock radio field",
      "mock-drawer-2": "mock drawer text field",
      "mock-standard-1": "mock text field",
      "mock-text-field": "mock text field",
    });
  });
});
