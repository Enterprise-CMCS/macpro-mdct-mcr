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

  describe("Program name (legacy and new formats)", () => {
    // Report template that requires the newer `report_programNameList` checkbox
    const reportWithProgramNameList = {
      ...mockMlrModalOverlayReport,
      formTemplate: {
        ...mockMlrModalOverlayReport.formTemplate,
        validationJson: {
          ...mockMlrModalOverlayReport.formTemplate.validationJson,
          report_programNameList: "checkbox",
          report_otherProgramName: "dynamicOptional",
        },
      },
    };

    const completeBaseEntity = {
      id: "1",
      "report_modal-text-field": "1",
      "report_optional-text-field": "2",
      "report_text-field": "3",
      "report_number-field": 4,
      "report_nested-field": [
        { key: "report_nested-field", value: "option 3" },
      ],
      "report_nested-text-field": "a",
    };

    test("is incomplete when no program name is provided", () => {
      expect(
        getMlrEntityStatus(completeBaseEntity, reportWithProgramNameList)
      ).not.toBeTruthy();
    });

    test("is complete when the program name checkbox is selected", () => {
      expect(
        getMlrEntityStatus(
          {
            ...completeBaseEntity,
            report_programNameList: [
              { key: "report_programNameList-medicaid", value: "Medicaid" },
            ],
          },
          reportWithProgramNameList
        )
      ).toBeTruthy();
    });

    test("is complete when only the legacy report_programName field is provided", () => {
      expect(
        getMlrEntityStatus(
          {
            ...completeBaseEntity,
            report_programName: "Legacy Program Name",
          },
          reportWithProgramNameList
        )
      ).toBeTruthy();
    });

    test("is complete when only the dynamic report_otherProgramName field is provided", () => {
      expect(
        getMlrEntityStatus(
          {
            ...completeBaseEntity,
            report_programNameList: [],
            report_otherProgramName: [{ id: "789", name: "Custom Program" }],
          },
          reportWithProgramNameList
        )
      ).toBeTruthy();
    });
  });
});
