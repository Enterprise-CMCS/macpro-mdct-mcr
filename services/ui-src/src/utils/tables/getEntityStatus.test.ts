// components
import { getEntityStatus } from "./getEntityStatus";
// types
import { ReportShape, ReportType } from "types";
// utils
import { getMlrEntityStatus, getNaaarEntityStatus } from "utils";

jest.mock("utils");

describe("getEntityStatus()", () => {
  const report = { reportType: ReportType.MLR } as ReportShape;
  const entity = { id: "mock-entity" };
  const entityType = "plans";

  test("calls getMlrEntityStatus() for MLR", () => {
    getEntityStatus(report, entity);
    expect(getMlrEntityStatus).toHaveBeenCalledWith(report, entity);
  });

  test("calls getNaaarEntityStatus() for NAAAR", () => {
    report.reportType = ReportType.NAAAR;
    getEntityStatus(report, entity, entityType);
    expect(getNaaarEntityStatus).toHaveBeenCalledWith(
      report,
      entity,
      entityType
    );
  });

  test("returns false for unknown report type", () => {
    report.reportType = "unknown";
    expect(getEntityStatus(report, entity)).toBe(false);
  });

  test("returns false for undefined report", () => {
    expect(getEntityStatus(report, undefined)).toBe(false);
  });

  test("returns false for undefined entity", () => {
    expect(getEntityStatus(undefined, entity)).toBe(false);
  });
});
