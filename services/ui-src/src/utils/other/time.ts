import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { DateShape, TimeShape } from "types";

export const midnight: TimeShape = { hour: 0, minute: 0, second: 0 };
export const oneSecondToMidnight: TimeShape = {
  hour: 23,
  minute: 59,
  second: 59,
};
export const noon: TimeShape = {
  hour: 12,
  minute: 0,
  second: 0,
};

export const calculateTimeByType = (timeType?: string): TimeShape => {
  const timeMap: any = {
    startDate: midnight,
    endDate: oneSecondToMidnight,
  };
  return timeMap?.[timeType as keyof typeof timeMap] || noon;
};

/*
 * Converts passed ET datetime to UTC
 * returns -> UTC datetime in format 'ms since Unix epoch'
 */
export const convertDateTimeEtToUtc = (
  etDate: DateShape,
  etTime: TimeShape
): number => {
  const { year, month, day } = etDate;
  const { hour, minute, second } = etTime;

  // month - 1 because Date object months are zero-indexed
  const utcDatetime = zonedTimeToUtc(
    new Date(year, month - 1, day, hour, minute, second),
    "America/New_York"
  );
  return utcDatetime.getTime();
};

/*
 * Converts passed ET date to UTC
 * returns -> UTC datetime in format 'ms since Unix epoch'
 */
export const convertDateEtToUtc = (date: string): number => {
  const [month, day, year] = date.split("/");

  // month - 1 because Date object months are zero-indexed
  const utcDatetime = zonedTimeToUtc(
    new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
    "America/New_York"
  );
  return utcDatetime.getTime();
};

/*
 * Converts passed UTC datetime to ET date
 * returns -> ET date in format mm/dd/yyyy
 */
export const convertDateUtcToEt = (date: number): string => {
  const convertedDate = date;
  const easternDatetime = utcToZonedTime(
    new Date(convertedDate),
    "America/New_York"
  );

  /*
   * This month code ensures the date has a preceeding 0 if the month is a single digit.
   * Ex: 7 becomes 07 while 10 stays 10
   */
  const month = ("0" + (new Date(easternDatetime).getMonth() + 1)).slice(-2);
  const day = new Date(easternDatetime).getDate();
  const year = new Date(easternDatetime).getFullYear();

  // month + 1 because Date object months are zero-indexed
  return `${month}/${day}/${year}`;
};

/*
 * Converts passed UTC datetime to a local date in the users timezone
 * returns -> User Timezone date in format Day of Week, Month Day, Year
 * Ex: Friday, August 12, 2022
 */
export const utcDateToReadableDate = (
  date: number,
  style?: "full" | "long" | "medium" | "short"
) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: style,
  }).format(date);
};

export const checkDateCompleteness = (date: string) => {
  const month = parseInt(date.split("/")?.[0]);
  const day = parseInt(date.split("/")?.[1]);
  const year = parseInt(date.split("/")?.[2]);
  const dateIsComplete = month && day && year.toString().length === 4;
  return dateIsComplete ? { year, month, day } : null;
};

export const convertDatetimeStringToNumber = (
  date: string,
  timeType: string | undefined
): number | undefined => {
  const completeDate = checkDateCompleteness(date);
  let convertedTime;
  if (completeDate) {
    const time = calculateTimeByType(timeType);
    convertedTime = convertDateTimeEtToUtc(completeDate, time);
  }
  return convertedTime || undefined;
};

export const checkDateRangeStatus = (
  startDate: number,
  endDate: number
): boolean => {
  const currentTime = new Date().valueOf();
  return currentTime >= startDate && currentTime <= endDate;
};

/*
 * Converts a date string to UTC + 180 days
 * returns -> UTC datetime in format 'ms since Unix epoch'
 * Ex: 6/30/22 Becomes 1483603200000
 */
export const calculateDueDate = (date: string) => {
  const gracePeriod = 1000 * 60 * 60 * 24 * 180; // 180 days in ms
  const [month, day, year] = date.split("/");
  const reportingPeriodEndDate = convertDateTimeEtToUtc(
    { year: parseInt(year), month: parseInt(month), day: parseInt(day) },
    noon
  );
  return reportingPeriodEndDate + gracePeriod;
};
