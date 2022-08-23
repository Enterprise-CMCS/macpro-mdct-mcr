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

export const calculateTimeByType = (
  timeType: string | undefined
): TimeShape => {
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
export const convertDateEtToUtc = (
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
 * Converts passed UTC datetime to ET date
 * returns -> ET date in format mm/dd/yyyy
 */
export const formatDateUtcToEt = (date: number): string => {
  const convertedDate = date;
  const easternDatetime = utcToZonedTime(
    new Date(convertedDate),
    "America/New_York"
  );
  const month = new Date(easternDatetime).getMonth();
  const day = new Date(easternDatetime).getDate();
  const year = new Date(easternDatetime).getFullYear();

  // month + 1 because Date object months are zero-indexed
  return `${month + 1}/${day}/${year}`;
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
    convertedTime = convertDateEtToUtc(completeDate, time);
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

const allottedTime = 180; // days
/*
 * Takes a date and adds 180 days to it
 * Ex: 6/30/22 Becomes 12/27/2022)
 */
export const calculateDueDate = (date: string) => {
  const givenDate = new Date(date);
  const dueDate = givenDate.setDate(givenDate.getDate() + allottedTime);
  return formatDateUtcToEt(dueDate);
};
