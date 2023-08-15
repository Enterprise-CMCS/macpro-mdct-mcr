import {
  checkStandardNumberInputAgainstRegexes,
  checkRatioInputAgainstRegexes,
} from "./checkInputValidity";

import { maskMap } from "./mask";

interface CleanedValue {
  isValid: boolean;
  cleanedValue: string;
}

export const cleanStandardNumericalInput = (value: string): CleanedValue => {
  // Check if valid input against regex
  const isValidNumber = checkStandardNumberInputAgainstRegexes(value);
  if (!isValidNumber) return { isValid: false, cleanedValue: value };

  // Remove all characters except 0123456789.-
  value = value.replace(/[^\d.-]/g, "");

  // If entire value is greater than 1, or less than -1, remove all leading zeros
  const parsedFloat = parseFloat(value);
  if (parsedFloat >= 1 || parsedFloat <= -1) {
    value = value.replace(/^0+/g, "");
  }

  return {
    isValid: true,
    cleanedValue: value,
  };
};

export const cleanRatioInput = (value: string): CleanedValue => {
  const isValidRatio = checkRatioInputAgainstRegexes(value);
  if (!isValidRatio.isValid) return { isValid: false, cleanedValue: value };

  // Clean the left side
  const leftSide = isValidRatio.leftSide;
  const cleanLeft = cleanStandardNumericalInput(leftSide);

  // Clean the right side
  const rightSide = isValidRatio.rightSide;
  const cleanRight = cleanStandardNumericalInput(rightSide);

  const cleanedValue = [cleanLeft.cleanedValue, cleanRight.cleanedValue].join(
    ":"
  );

  return {
    isValid: true,
    cleanedValue: cleanedValue,
  };
};

export const makeStringParseableForDatabase = (
  value: string,
  maskName?: keyof typeof maskMap | null
) => {
  if (maskName === null) return value;

  // convert to parseable ratio
  if (maskName === "ratio") return value.replace(/[^\d.:-]/g, "");

  // convert to parseable float
  return value.replace(/[^\d.-]/g, "");
};
