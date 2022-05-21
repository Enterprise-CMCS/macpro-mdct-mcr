import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
// import { getBanner } from "../api/requestMethods/banner";

interface DateShape {
  year: number;
  month: number;
  day: number;
}

/*
 * Uses zonedTimeToUtc to calculate the specififed
 * UTC datetime and returns as 'ms since Unix epoch'
 */
export const makeStartDate = (startDate: DateShape): number => {
  const { year, month, day } = startDate;
  const utcDatetime = zonedTimeToUtc(
    new Date(year, month - 1, day, 0, 0, 0),
    "America/New_York"
  );
  return utcDatetime.getTime();
};

/*
 * Uses zonedTimeToUtc to calculate the specififed
 * UTC datetime and returns as 'ms since Unix epoch'
 */
export const makeEndDate = (endDate: DateShape): number => {
  const { year, month, day } = endDate;
  // month - 1 because Date object months are zero-indexed
  const utcDatetime = zonedTimeToUtc(
    new Date(year, month - 1, day, 23, 59, 59),
    "America/New_York"
  );
  return utcDatetime.getTime();
};

/*
 * Converts specified time from 'ms since Unix epoch'
 * to Eastern Time and returns as date string
 */
export const formatDate = (date: number): string => {
  const easternDatetime = utcToZonedTime(new Date(date), "America/New_York");
  const month = new Date(easternDatetime).getMonth();
  const day = new Date(easternDatetime).getDate();
  const year = new Date(easternDatetime).getFullYear().toString().slice(-2);

  // month + 1 because Date object months are zero-indexed
  return `${month + 1}/${day}/${year}`;
};

/*
 * Accepts a start datetime and end datetime and
 * checks if current datetime is within range
 */
export const checkBannerActiveDates = (
  startDate: number,
  endDate: number
): boolean => {
  const currentTime = new Date().valueOf();
  return currentTime >= startDate && currentTime <= endDate;
};
