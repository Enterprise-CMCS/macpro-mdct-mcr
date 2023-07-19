import { cleanStandardNumericalInput, cleanRatioInput } from "./clean";

export const maskMap = {
  "comma-separated": convertToThousandsSeparatedString,
  percentage: convertToThousandsSeparatedString,
  ratio: convertToThousandsSeparatedRatioString,
  currency: convertToThousandsSeparatedString,
};

/**
 * Converts a number-like string to a comma seperated value
 * @param {String} value
 * @returns {String}
 */
export function convertToThousandsSeparatedString(
  value: string,
  fixedDecimalPlaces?: number | undefined
): string {
  // Check value validity, and if invalid, bypass all masking and return user-inputted value
  const cleanedInput = cleanStandardNumericalInput(value);
  if (!cleanedInput.isValid) return value;

  // If valid, take cleaned value and continue to masking
  let maskValue = cleanedInput.cleanedValue;

  if (fixedDecimalPlaces) {
    // Convert String to a float to begin operation
    const valueAsFloat = parseFloat(maskValue);

    // Slide any extra decimals down to number of fixedDecimalPlaces
    const fixedDecimal = valueAsFloat.toFixed(fixedDecimalPlaces);
    maskValue = Number(fixedDecimal).toLocaleString("en", {
      minimumFractionDigits: fixedDecimalPlaces,
      maximumFractionDigits: fixedDecimalPlaces,
    });
    return maskValue.toString();
  }

  // Add in commas to delineate thousands (if needed)
  maskValue = Number(maskValue).toLocaleString("en", {
    // .toLocaleString rounds to 3 decimal places by default, so we have to set a minimum and maximum
    minimumFractionDigits: 0,
    maximumFractionDigits: maskValue.length,
  });
  return maskValue.toString();
}

/**
 * Splits a string with a : and converts each side to a comma-separated string
 * @param {String} value
 * @returns {String}
 */
export function convertToThousandsSeparatedRatioString(
  value: string,
  fixedDecimalPlaces?: number | undefined
): string {
  // Clean value
  const cleanedInput = cleanRatioInput(value);
  if (!cleanedInput.isValid) return value;

  // Grab the left and right side of the ratio sign
  const values = cleanedInput.cleanedValue.split(":");

  // Create the left side of the output and make the number (if provided) pretty
  values[0] = convertToThousandsSeparatedString(values[0], fixedDecimalPlaces);

  // Create the right side of the output and make the number (if provided) pretty
  values[1] = convertToThousandsSeparatedString(values[1], fixedDecimalPlaces);

  const maskedValue = values.join(":");
  return maskedValue;
}

// if valid custom mask, return masked value; else return value
export const applyMask = (
  value: string,
  maskName?: keyof typeof maskMap | null
): string => {
  // if maskName is specified as null, bypass all masking and return user-inputted value
  if (maskName === null) return value;

  // apply specified mask or default to comma-separated mask
  const maskToApply = maskName
    ? maskMap[maskName]
    : convertToThousandsSeparatedString;

  // if currency field, we want to round to 2 decimal places
  return maskName === "currency" ? maskToApply(value, 2) : maskToApply(value);
};
