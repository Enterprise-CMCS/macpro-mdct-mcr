import { getStatus, tableBody } from "./DashboardTableUtils";
import { describe, expect, test } from "vitest";

describe("DashboardTableUtils", () => {
  describe("getStatus()", () => {
    test("should render 'Archived' if report has been archived", () => {
      expect(getStatus("Not Started", true, 0)).toBe("Archived");
      expect(getStatus("In progress", true, 0)).toBe("Archived");
      expect(getStatus("Submitted", true, 1)).toBe("Archived");
    });

    test("should override incomplete statuses with 'In Revision' if report has been submitted", () => {
      expect(getStatus("Not started", false, 1)).toBe("In revision");
      expect(getStatus("In progress", false, 1)).toBe("In revision");
    });

    test("should render status as-is otherwise", () => {
      expect(getStatus("Not Started", false, 0)).toBe("Not Started");
      expect(getStatus("In progress", false, 0)).toBe("In progress");
      expect(getStatus("Submitted", false, 1)).toBe("Submitted");
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
