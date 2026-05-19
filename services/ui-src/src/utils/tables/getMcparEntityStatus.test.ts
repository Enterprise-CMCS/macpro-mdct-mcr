// components
import { getMcparEntityStatus } from "./getMcparEntityStatus";
// types
import { EntityType } from "types";
// utils
import {
  mockDrawerForm,
  mockModalOverlayReportPageJson,
} from "utils/testing/mockForm";
import { mockMcparReport } from "utils/testing/mockReport";
import * as entityRows from "./entityRows";

const completionSpy = jest.spyOn(entityRows, "calculateIsEntityCompleted");

const entity = {
  id: "mock-measure",
};
const entityType = EntityType.QUALITY_MEASURES;
const route = {
  ...mockModalOverlayReportPageJson,
  drawerForm: mockDrawerForm,
};

const reportWithoutPlans = {
  ...mockMcparReport,
  fieldData: {},
};

describe("getMcparEntityStatus()", () => {
  test("returns false by default", () => {
    expect(
      getMcparEntityStatus(entity, mockMcparReport, entityType, route)
    ).toBe(false);
  });

  test("returns false for entities other than quality measures", () => {
    expect(
      getMcparEntityStatus(entity, mockMcparReport, EntityType.PLANS, route)
    ).toBe(false);
  });

  test("returns false when no plans in report", () => {
    expect(
      getMcparEntityStatus(entity, reportWithoutPlans, entityType, route)
    ).toBe(false);
  });

  test("returns false when no drawer form", () => {
    expect(
      getMcparEntityStatus(
        entity,
        mockMcparReport,
        entityType,
        mockModalOverlayReportPageJson
      )
    ).toBe(false);
  });

  test("returns false if any completions come back false", () => {
    completionSpy.mockReturnValueOnce(false).mockReturnValue(true);
    expect(
      getMcparEntityStatus(entity, mockMcparReport, entityType, route)
    ).toBe(false);
  });

  test("returns true if all completions pass", () => {
    completionSpy.mockReturnValue(true);
    expect(
      getMcparEntityStatus(entity, mockMcparReport, entityType, route)
    ).toBe(true);
  });
});
