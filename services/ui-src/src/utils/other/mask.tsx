// constants
import { suppressionText } from "../../constants";
// utils
import { validNAValues } from "utils";
import { cleanStandardNumericalInput, cleanRatioInput } from "./clean";

export const maskMap = {
  "comma-separated": convertToThousandsSeparatedString,
  percentage: convertToThousandsSeparatedString,
  ratio: convertToThousandsSeparatedRatioString,
  currency: convertToThousandsSeparatedString,
};

interface MaskedValue {
  isValid: boolean;
  maskedValue: string;
}

// mask response data as necessary
export function maskResponseData(
  fieldResponseData: any,
  fieldMask?: string
): string {
  if (
    fieldResponseData === undefined ||
    validNAValues.includes(fieldResponseData) ||
    fieldResponseData === suppressionText
  )
    return fieldResponseData;

  const numericValue = Number(fieldResponseData);

  let minimumFractionDigits = 0;
  if (fieldMask === "currency" && !Number.isInteger(numericValue)) {
    minimumFractionDigits = 2;
  }

  const maskValue = numericValue.toLocaleString("en", {
    // .toLocaleString rounds to 3 decimal places by default, so we have to set a minimum and maximum
    minimumFractionDigits,
    maximumFractionDigits: fieldResponseData.length,
  });

  switch (fieldMask) {
    case "percentage":
      return maskValue + "%";
    case "currency":
      if (numericValue < 0) {
        return "-$" + maskValue.substring(1);
      }
      return "$" + maskValue;
    case "ratio": {
      let sidesOfRatio = fieldResponseData.split(":");
      return (
        maskResponseData(sidesOfRatio[0]) +
        ":" +
        maskResponseData(sidesOfRatio[1])
      );
    }
    default:
      return maskValue;
  }
}

/**
 * Converts a number-like string to a comma seperated value
 * @param {String} value
 * @returns {MaskedValue}
 */
export function convertToThousandsSeparatedString(
  value: string,
  fixedDecimalPlaces?: number | undefined
): MaskedValue {
  // Check value validity, and if invalid, bypass all masking and return user-inputted value
  const cleanedInput = cleanStandardNumericalInput(value);
  if (!cleanedInput.isValid) return { isValid: false, maskedValue: value };

  // If valid, take cleaned value and continue to masking
  let maskValue = cleanedInput.cleanedValue;

  if (fixedDecimalPlaces || fixedDecimalPlaces === 0) {
    // Convert String to a float to begin operation
    const valueAsFloat = parseFloat(maskValue);

    // Slide any extra decimals down to number of fixedDecimalPlaces
    const fixedDecimal = valueAsFloat.toFixed(fixedDecimalPlaces);
    maskValue = Number(fixedDecimal).toLocaleString("en", {
      minimumFractionDigits: fixedDecimalPlaces,
      maximumFractionDigits: fixedDecimalPlaces,
    });
    return { isValid: true, maskedValue: maskValue };
  }

  // Add in commas to delineate thousands (if needed)
  maskValue = Number(maskValue).toLocaleString("en", {
    // .toLocaleString rounds to 3 decimal places by default, so we have to set a minimum and maximum
    minimumFractionDigits: 0,
    maximumFractionDigits: maskValue.length,
  });
  return { isValid: true, maskedValue: maskValue };
}

/**
 * Splits a string with a : and converts each side to a comma-separated string
 * @param {String} value
 * @returns {String}
 */
export function convertToThousandsSeparatedRatioString(
  value: string,
  fixedDecimalPlaces?: number | undefined
): MaskedValue {
  // Clean value
  const cleanedInput = cleanRatioInput(value);
  if (!cleanedInput.isValid) return { isValid: false, maskedValue: value };

  // Grab the left and right side of the ratio sign
  const values = cleanedInput.cleanedValue.split(":");

  // Create the left side of the output and make the number (if provided) pretty
  values[0] = convertToThousandsSeparatedString(
    values[0],
    fixedDecimalPlaces
  ).maskedValue;

  // Create the right side of the output and make the number (if provided) pretty
  values[1] = convertToThousandsSeparatedString(
    values[1],
    fixedDecimalPlaces
  ).maskedValue;

  const maskedValue = values.join(":");
  return { isValid: true, maskedValue: maskedValue };
}

// if valid custom mask, return masked value; else return value
export const applyMask = (
  value: string,
  maskName?: keyof typeof maskMap | null,
  fixedDecimalPlaces?: number | undefined
): MaskedValue => {
  // if maskName is specified as null, bypass all masking and return user-inputted value
  if (!maskName) return { isValid: false, maskedValue: value };

  // apply specified mask or default to comma-separated mask
  const maskToApply = maskName
    ? maskMap[maskName]
    : convertToThousandsSeparatedString;

  // currency field defaults to 2, all other fields default to undefined
  if (typeof fixedDecimalPlaces === "undefined" && maskName === "currency") {
    fixedDecimalPlaces = 2;
  }

  return maskToApply(value, fixedDecimalPlaces);
};
