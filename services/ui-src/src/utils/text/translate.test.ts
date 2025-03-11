import { translate, translateVerbiage } from "./translate";

describe("utils/text/translate", () => {
  const stateName = "State Name";
  const heading = "Heading";
  const reportYear = "2024";
  const reportPeriod = "1";

  describe("translate()", () => {
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

  describe("translateVerbiage()", () => {
    const verbiage = {
      title:
        "{{stateName}} {{heading}} {{reportYear}} - Period {{reportPeriod}}",
      sub: {
        title:
          "{{stateName}} {{heading}} {{reportYear}} - Period {{reportPeriod}}",
      },
      html: [
        {
          type: "p",
          content:
            "{{stateName}} {{heading}} {{reportYear}} - Period {{reportPeriod}}",
        },
      ],
    };
    const translatedVerbiage = {
      title: "State Name Heading 2024 - Period 1",
      sub: {
        title: "State Name Heading 2024 - Period 1",
      },
      html: [
        {
          type: "p",
          content: "State Name Heading 2024 - Period 1",
        },
      ],
    };

    test("returns translated verbiage", () => {
      const result = translateVerbiage(verbiage, {
        stateName,
        heading,
        reportYear,
        reportPeriod,
      });
      expect(result).toEqual(translatedVerbiage);
    });

    test("returns empty object for undefined values", () => {
      const result = translateVerbiage(undefined, undefined);
      expect(result).toEqual({});
    });
  });
});
