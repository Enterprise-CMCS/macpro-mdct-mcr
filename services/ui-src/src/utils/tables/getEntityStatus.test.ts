import { ReportShape, ReportType } from "types";
import { getEntityStatus } from "./getEntityStatus";
import { getMlrEntityStatus, getNaaarEntityStatus } from "utils";

jest.mock("utils");

describe("getEntityStatus()", () => {
  const report = { reportType: ReportType.MLR } as ReportShape;
  const entity = { id: "mock-entity" };

  test("calls getMlrEntityStatus() for MLR", () => {
    getEntityStatus(report, entity);
    expect(getMlrEntityStatus).toHaveBeenCalledWith(report, entity);
  });

  test("returns false for NAAAR", () => {
    report.reportType = ReportType.NAAAR;
    getEntityStatus(report, entity);
    expect(getNaaarEntityStatus).toHaveBeenCalled();
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
