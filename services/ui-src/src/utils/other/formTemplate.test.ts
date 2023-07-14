import { ModalOverlayReportPageShape } from "types";
import {
  mockFlattenedReportRoutes,
  mockReportJson,
} from "utils/testing/setupJest";
import {
  compileValidationJsonFromRoutes,
  copyAdminDisabledStatusToForms,
} from "./formTemplate";

describe("Test copyAdminDisabledStatusToForms", () => {
  it("Copies disabled status to nested forms of any kind", () => {
    const mockAdminDisabledReportJson = {
      ...mockReportJson,
      adminDisabled: true,
    };
    const result = copyAdminDisabledStatusToForms(mockAdminDisabledReportJson);

    const testStandardPageForm = result.routes[0].form;
    const testDrawerPageForm = result.routes[1].children![0].drawerForm!;
    const testModalDrawerPageModalForm =
      result.routes[1].children![1].modalForm!;
    const testModalDrawerPageDrawerForm =
      result.routes[1].children![1].drawerForm!;
    const testModalOverlayPageForm = (
      result.routes[1].children![1] as ModalOverlayReportPageShape
    ).overlayForm!;

    expect(testStandardPageForm!.adminDisabled).toBeTruthy();
    expect(testDrawerPageForm!.adminDisabled).toBeTruthy();
    expect(testModalDrawerPageModalForm!.adminDisabled).toBeTruthy();
    expect(testModalDrawerPageDrawerForm!.adminDisabled).toBeTruthy();
    expect(testModalOverlayPageForm!.adminDisabled).toBeTruthy();
  });
});

describe("Test compileValidationJsonFromRoutes", () => {
  it("Compiles validation from forms of any kind", () => {
    const result = compileValidationJsonFromRoutes(mockFlattenedReportRoutes);
    expect(result).toEqual({
      accessMeasures: "objectArray",
      program: "objectArray",
      "mock-text-field": "text",
      "mock-drawer-text-field": "text",
      "mock-modal-text-field": "text",
      "mock-modal-overlay-text-field": "text",
      "mock-optional-text-field": "textOptional",
      "with-label": "text",
      "mock-nested-field": "radio",
    });
  });
});
