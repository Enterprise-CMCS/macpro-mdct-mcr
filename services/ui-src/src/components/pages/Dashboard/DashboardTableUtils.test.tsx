import { getStatus, tableBody } from "./DashboardTableUtils";
import { describe, expect, test } from "vitest";

describe("DashboardTableUtils", () => {
  describe("getStatus()", () => {
    test("should render the correct status if report has been unlocked", () => {
      expect(getStatus("In progress", false, 1)).toBe("In revision");
    });

    test("should render the correct status if report has been unlocked", () => {
      expect(getStatus("In progress", false, 0)).toBe("In progress");
    });

    test("should render the correct status if report has been archived", () => {
      expect(getStatus("In progress", true, 1)).toBe("Archived");
    });

    test("should render the correct status if report has been unlocked", () => {
      expect(getStatus("Submitted", false, 1)).toBe("Submitted");
    });

    test("should render the correct status if report has been unlocked", () => {
      expect(getStatus("Not started", false, 1)).toBe("In revision");
    });
  });

  describe("tableBody()", () => {
    const body = {
      headRow: ["row1", "#"],
    };
    const stateBody = {
      headRow: ["row1"],
    };

    test("should return all rows for admin", () => {
      expect(tableBody(body, true)).toEqual(body);
    });

    test("should remove # row for non-admin", () => {
      expect(tableBody(body, false)).toEqual(stateBody);
    });
  });
});
