import {
  calculateDueDate,
  calculateTimeByType,
  checkDateRangeStatus,
  convertDateEtToUtc,
  convertDateTimeEtToUtc,
  convertDateUtcToEt,
  midnight,
  noon,
  oneSecondToMidnight,
} from "./time";

// 1/1/2022 @ 00:00:00
const testDate = {
  utcMS: 1641013200000,
  utcString: "Sat, 01 Jan 2022 05:00:00 GMT",
  etFormattedString: "01/1/2022",
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

describe("Test convertDateTimeEtToUtc", () => {
  test("Valid ET datetime converts to UTC correctly", () => {
    const result = convertDateTimeEtToUtc(
      { year: 2022, month: 1, day: 1 },
      { hour: 0, minute: 0, second: 0 }
    );
    expect(result).toBe(testDate.utcMS);
    expect(new Date(result).toUTCString()).toBe(testDate.utcString);
  });
});

describe("Test convertDateEtToUtc", () => {
  test("Valid ET datetime converts to UTC correctly", () => {
    const result = convertDateEtToUtc(testDate.etFormattedString);
    expect(result).toBe(testDate.utcMS);
    expect(new Date(result).toUTCString()).toBe(testDate.utcString);
  });
});

describe("Test convertDateUtcToEt", () => {
  test("Valid UTC datetime converts to ET correctly", () => {
    const result = convertDateUtcToEt(testDate.utcMS);
    expect(result).toBe(testDate.etFormattedString);
  });
});

describe("Test checkDateRangeStatus", () => {
  const currentTime = Date.now(); // 'current' time in ms since unix epoch
  const oneDay = 1000 * 60 * 60 * 24; // 1000ms * 60s * 60m * 24h = 86,400,000ms
  const twoDays = oneDay * 2;

  it("returns false if startDate is in the future", () => {
    const startDate = currentTime + oneDay;
    const endDate = currentTime + twoDays;
    const dateRangeStatus = checkDateRangeStatus(startDate, endDate);
    expect(dateRangeStatus).toBeFalsy();
  });

  it("returns false if endDate is in the past", () => {
    const startDate = currentTime - twoDays;
    const endDate = currentTime - oneDay;
    const dateRangeStatus = checkDateRangeStatus(startDate, endDate);
    expect(dateRangeStatus).toBeFalsy();
  });

  it("returns true if startDate is in the past and endDate is in the future", () => {
    const startDate = currentTime - oneDay;
    const endDate = currentTime + oneDay;
    const dateRangeStatus = checkDateRangeStatus(startDate, endDate);
    expect(dateRangeStatus).toBeTruthy();
  });
});

describe("Test calculateDueDate", () => {
  it("calculateDueDate for 01/01/2022 for single year", () => {
    const startDate = "01/01/2022";
    const dueDate = calculateDueDate(startDate);
    expect(convertDateUtcToEt(dueDate)).toBe("06/30/2022");
  });

  it("calculateDueDate for 08/01/2022 for rollover year", () => {
    const startDate = "08/01/2022";
    const dueDate = calculateDueDate(startDate);
    expect(convertDateUtcToEt(dueDate)).toBe("01/28/2023");
  });
});
