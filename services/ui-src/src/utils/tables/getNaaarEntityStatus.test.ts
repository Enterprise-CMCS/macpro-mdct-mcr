// components
import { getNaaarEntityStatus } from "./getNaaarEntityStatus";
// types
import { EntityType, ReportShape, ReportType } from "types";

describe("getNaaarEntityStatus()", () => {
  const report = { reportType: ReportType.NAAAR } as ReportShape;
  const entity = {
    id: "mock-entity",
    planCompliance43868_assurance: [{ id: "mockYes", value: "Mock Yes" }],
    planCompliance438206_assurance: [{ id: "mockYes", value: "Mock Yes" }],
  };
  const entityType = EntityType.PLANS;

  test("returns true for plans", () => {
    expect(getNaaarEntityStatus(entity, report, entityType)).toBe(true);
  });

  test("returns false by default", () => {
    expect(getNaaarEntityStatus(entity, report)).toBe(false);
  });
});
