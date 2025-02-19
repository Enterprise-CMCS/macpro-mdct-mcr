import { ReportShape, ReportType } from "types";
import { getNaaarEntityStatus } from "./getNaaarEntityStatus";

describe("getNaaarEntityStatus()", () => {
  const report = { reportType: ReportType.NAAAR } as ReportShape;
  const entity = { id: "mock-entity" };
  const entityType = "plans";

  test("returns false", () => {
    expect(getNaaarEntityStatus(report, entity, entityType)).toBe(false);
  });
});
