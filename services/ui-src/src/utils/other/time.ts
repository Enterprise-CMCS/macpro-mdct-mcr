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

export const calculateTimeByDateType = (dateType: string): TimeShape => {
  const timeMap: any = {
    "abf-startDate": midnight,
    "abf-endDate": oneSecondToMidnight,
  };
  return timeMap[dateType] || noon;
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
