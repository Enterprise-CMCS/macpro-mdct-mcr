import { copyFieldDataFromSource, makePCCMModifications } from "./reports";
import { ReportType } from "../../utils/types";
import { mockReportJson } from "../../utils/testing/setupJest";
describe("Test copyFieldDataFromSource", () => {
  test("Test copyFieldDataFromSource returns validatedField data if reportType is not MCPAR", async () => {
    const res = await copyFieldDataFromSource(
      "database-local-mcpar",
      "Minnesota",
      "mockReportJson",
      mockReportJson,
      { stateName: "Minnesota" },
      ReportType.MLR
    );
    expect(res).toEqual({ stateName: "Minnesota" });
  });

  test("Test makePCCMModifications sets correct field data", () => {
    let testFieldData = {};
    testFieldData = makePCCMModifications(testFieldData);
    expect(testFieldData).toEqual({
      program_type: [
        {
          key: "program_type-atiwcA9QUE2eoTchV2ZLtw", // pragma: allowlist secret
          value: "Primary Care Case Management (PCCM) Entity",
        },
      ],
    });
  });
});
