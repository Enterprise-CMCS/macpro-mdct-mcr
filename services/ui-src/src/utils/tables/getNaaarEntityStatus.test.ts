// components
import { getNaaarEntityStatus } from "./getNaaarEntityStatus";
// types
import { EntityType, ReportShape, ReportType } from "types";

describe("getNaaarEntityStatus()", () => {
  const report = { reportType: ReportType.NAAAR } as ReportShape;
  const entity = {
    id: "mock-entity",
    planCompliance438206_assurance: [],
    planCompliance43868_assurance: [],
  };
  const entityType = EntityType.PLANS;

  test("returns false", () => {
    expect(getNaaarEntityStatus(entity, report)).toBe(false);
  });

  test("returns true", () => {
    expect(getNaaarEntityStatus(entity, report, entityType)).toBe(true);
  });
});
