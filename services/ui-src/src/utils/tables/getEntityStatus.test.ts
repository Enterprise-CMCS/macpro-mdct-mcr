// components
import { getEntityStatus } from "./getEntityStatus";
// types
import { EntityType, ReportShape, ReportType } from "types";
// utils
import { getMlrEntityStatus, getNaaarEntityStatus } from "utils";

jest.mock("utils");

describe("getEntityStatus()", () => {
  const report = { reportType: ReportType.MLR } as ReportShape;
  const entity = { id: "mock-entity" };
  const entityType = EntityType.PLANS;

  test("calls getMlrEntityStatus() for MLR", () => {
    getEntityStatus(entity, report);
    expect(getMlrEntityStatus).toHaveBeenCalledWith(entity, report);
  });

  test("calls getNaaarEntityStatus() for NAAAR", () => {
    report.reportType = ReportType.NAAAR;
    getEntityStatus(entity, report, entityType);
    expect(getNaaarEntityStatus).toHaveBeenCalledWith(
      entity,
      report,
      entityType
    );
  });

  test("returns false for unknown report type", () => {
    report.reportType = "unknown";
    expect(getEntityStatus(entity, report)).toBe(false);
  });

  test("returns false for undefined report", () => {
    expect(getEntityStatus(entity, undefined)).toBe(false);
  });
});
