import { copyFieldDataFromSource } from "./reports";
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
});
