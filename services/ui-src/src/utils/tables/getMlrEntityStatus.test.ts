import { mockMlrModalOverlayReport } from "utils/testing/setupJest";
import { getMlrEntityStatus } from "./getMlrEntityStatus";

describe("Test getMlrEntityStatus", () => {
  test("should return a truthy value if complete", () => {
    const report = mockMlrModalOverlayReport;
    expect(
      getMlrEntityStatus(
        {
          id: "1",
          "report_modal-text-field": "1",
          "report_optional-text-field": "2",
          "report_text-field": "3",
          "report_number-field": 4,
          "report_nested-field": [
            { key: "report_nested-field", value: "option 3" },
          ],
          "report_nested-text-field": "a",
        },
        report
      )
    ).toBeTruthy();
  });

  test("should return a falsy value if incomplete", () => {
    const report = mockMlrModalOverlayReport;
    expect(
      getMlrEntityStatus(
        {
          id: "1",
          "report_modal-text-field": "1",
          "report_optional-text-field": "2",
          "report_text-field": null,
          "report_number-field": null,
          "report_nested-field": [
            { key: "report_nested-field", value: "option 3" },
          ],
          "report_nested-text-field": "a",
        },
        report
      )
    ).not.toBeTruthy();
  });
});
