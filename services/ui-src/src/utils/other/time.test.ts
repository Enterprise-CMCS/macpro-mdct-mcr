import {
  calculateTimeByType,
  convertDateEtToUtc,
  formatDateUtcToEt,
  midnight,
  noon,
  oneSecondToMidnight,
} from "./time";

// 1/1/2022 @ 00:00:00
const testDate = {
  utcMS: 1641013200000,
  utcString: "Sat, 01 Jan 2022 05:00:00 GMT",
  etFormattedString: "1/1/22",
};

describe("Test calculateTimeByType", () => {
  test("known timeType returns correct datetime", () => {
    const startDateTest = calculateTimeByType("startDate");
    expect(startDateTest).toEqual(midnight);

    const endDateTest = calculateTimeByType("endDate");
    expect(endDateTest).toEqual(oneSecondToMidnight);
  });

  test("unknown timeType returns noon datetime", () => {
    const unknownTest = calculateTimeByType("whatever");
    expect(unknownTest).toEqual(noon);
  });
});

describe("Test convertDateEtToUtc", () => {
  test("Valid ET datetime converts to UTC correctly", () => {
    const result = convertDateEtToUtc(
      { year: 2022, month: 1, day: 1 },
      { hour: 0, minute: 0, second: 0 }
    );
    expect(result).toBe(testDate.utcMS);
    expect(new Date(result).toUTCString()).toBe(testDate.utcString);
  });
});

describe("Test formatDateUtcToEt", () => {
  test("Valid UTC datetime converts to ET correctly", () => {
    const result = formatDateUtcToEt(testDate.utcMS);
    expect(result).toBe(testDate.etFormattedString);
  });
});
