import {
  checkStandardNumberInputAgainstRegexes,
  checkRatioInputAgainstRegexes,
} from "./checkInputValidity";

interface CleanedValue {
  isValid: boolean;
  cleanedValue: string;
}

export const cleanStandardNumericalInput = (value: string): CleanedValue => {
  // Check if valid input against regex
  const isValidNumber = checkStandardNumberInputAgainstRegexes(value);
  if (!isValidNumber) return { isValid: false, cleanedValue: value };

  // Remove all characters except digits and decimal points.
  value = value.replace(/[^\d.-]/g, "");

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

  const cleanedValue = [cleanLeft, cleanRight].join(":");

  return {
    isValid: true,
    cleanedValue: cleanedValue,
  };
};
