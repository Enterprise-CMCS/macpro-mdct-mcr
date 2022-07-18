import { calculateTimeByDateType, convertDateEtToUtc } from "utils/other/time";

export const convertDatetimeStringToNumber = (
  date: string,
  fieldName: string
) => {
  const year = parseInt(date.split("/")?.[2]);
  const month = parseInt(date.split("/")?.[0]);
  const day = parseInt(date.split("/")?.[1]);
  let convertedTime = undefined;
  if (year && month && day) {
    const time = calculateTimeByDateType(fieldName);
    convertedTime = convertDateEtToUtc({ year, month, day }, time);
  }
  return convertedTime;
};
