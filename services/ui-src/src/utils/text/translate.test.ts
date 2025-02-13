import { translate } from "./translate";

describe("translate()", () => {
  const stateName = "State Name";
  const heading = "Heading";
  const reportYear = "2024";
  const reportPeriod = "1";

  test("returns translated text", () => {
    const result = translate(
      "{{stateName}} {{heading}} {{reportYear}} - Period {{reportPeriod}}",
      { stateName, heading, reportYear, reportPeriod }
    );
    expect(result).toBe("State Name Heading 2024 - Period 1");
  });

  test("returns empty value for missing key", () => {
    const result = translate(
      "{{stateName}} {{heading}} {{reportYear}} - Period {{reportPeriod}}",
      { heading, reportYear, reportPeriod }
    );

    expect(result).toBe(" Heading 2024 - Period 1");
  });

  test("returns empty value for non-existent key", () => {
    const result = translate(
      "{{stateName}} {{heading}} {{reportYear}} - Period {{reportPeriod}}",
      { stateName, nonExistent: "nonExistent", reportYear, reportPeriod }
    );

    expect(result).toBe("State Name  2024 - Period 1");
  });

  test("returns empty string for undefined values", () => {
    const result = translate(undefined, undefined);
    expect(result).toBe("");
  });
});
