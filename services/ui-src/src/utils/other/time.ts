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

export const calculateTimeByType = (timeType: string): TimeShape => {
  const timeMap: any = {
    startDate: midnight,
    endDate: oneSecondToMidnight,
  };
  return timeMap[timeType] || noon;
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
  const year = new Date(easternDatetime).getFullYear().toString().slice(-2);

  // month + 1 because Date object months are zero-indexed
  return `${month + 1}/${day}/${year}`;
};

export const convertDatetimeStringToNumber = (
  date: string,
  timeType: string
): number | undefined => {
  const month = parseInt(date.split("/")?.[0]);
  const day = parseInt(date.split("/")?.[1]);
  const year = parseInt(date.split("/")?.[2]);
  let convertedTime;
  if (month && day && year.toString().length === 4) {
    const time = calculateTimeByType(timeType);
    convertedTime = convertDateEtToUtc({ year, month, day }, time);
  }
  return convertedTime || undefined;
};
