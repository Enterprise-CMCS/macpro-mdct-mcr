import { ReportType } from "types";
import { getStatus } from "./DashboardTable";
describe("Test getStatus utility", () => {
  test("should render the correct status if report has been unlocked", () => {
    expect(getStatus(ReportType.MLR, "In progress", false, 1)).toBe(
      "In revision"
    );
  });
  test("should render the correct status if report has been unlocked", () => {
    expect(getStatus(ReportType.MLR, "In progress", false, 0)).toBe(
      "In progress"
    );
  });
  test("should render the correct status if report has been archived", () => {
    expect(getStatus(ReportType.MLR, "In progress", true, 1)).toBe("Archived");
  });
  test("should render the correct status if report has been unlocked", () => {
    expect(getStatus(ReportType.MLR, "Submitted", false, 1)).toBe("Submitted");
  });

  test("should render the correct status if report has been unlocked", () => {
    expect(getStatus(ReportType.MLR, "Not started", false, 1)).toBe(
      "In revision"
    );
  });
  test("should render the correct status for MCPAR reports", () => {
    expect(getStatus(ReportType.MCPAR, "In progress", false, 1)).toBe(
      "In progress"
    );
  });
  test("should render the correct status for MCPAR reports", () => {
    expect(getStatus(ReportType.MCPAR, "Not started", false, 1)).toBe(
      "Not started"
    );
  });
});
