import { mockMlrModalOverlayReport } from "utils/testing/setupTests";
import { describe, expect, test } from "vitest";
import { getMlrEntityStatus } from "./getMlrEntityStatus";

describe("Test getMlrEntityStatus", () => {
  test("should return a truthy value if complete", () => {
    const report = mockMlrModalOverlayReport;
    expect(
      getMlrEntityStatus(report, {
        id: "1",
        "report_modal-text-field": "1",
        "report_optional-text-field": "2",
        "report_text-field": "3",
        "report_number-field": 4,
        "report_nested-field": [
          { key: "report_nested-field", value: "option 3" },
        ],
        "report_nested-text-field": "a",
      })
    ).toBeTruthy();
  });

  test("should return a falsy value if incomplete", () => {
    const report = mockMlrModalOverlayReport;
    expect(
      getMlrEntityStatus(report, {
        id: "1",
        "report_modal-text-field": "1",
        "report_optional-text-field": "2",
        "report_text-field": null,
        "report_number-field": null,
        "report_nested-field": [
          { key: "report_nested-field", value: "option 3" },
        ],
        "report_nested-text-field": "a",
      })
    ).not.toBeTruthy();
  });
});
