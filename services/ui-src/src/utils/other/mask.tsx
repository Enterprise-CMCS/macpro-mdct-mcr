import { cleanStandardNumericalInput, cleanRatioInput } from "./clean";
//const validNumberRegex = new RegExp("/[d.-]+/"); // digits (0-9), decimal (.), negative (-)

export const maskMap = {
  "comma-separated": convertToThousandsSeparatedString,
  percentage: convertToThousandsSeparatedString,
  ratio: convertToThousandsSeparatedString,
  currency: convertToThousandsSeparatedString,
};

/**
 * Converts a number-like string to a comma seperated value
 * @param {String} value
 * @returns {String}
 */
export function convertToThousandsSeparatedString(value: string): string {
  // Check value validity, and if invalid, bypass all masking and return user-inputted value
  const cleanedInput = cleanStandardNumericalInput(value);
  if (!cleanedInput.isValid) return value;

  // If valid, take cleaned value and continue to masking
  let cleanedValue = cleanedInput.cleanedValue;

  // Remove all characters except 0123456789.-
  cleanedValue = cleanedValue.replace(/[^\d.-]/g, "");

  // If entire value is not 0, remove all leading zeros
  if (parseFloat(cleanedValue) !== 0) {
    // Remove all leading zeroes if value is not equal to 0
    cleanedValue = cleanedValue.replace(/^0+/g, "");
  }

  // Convert String to a float to begin operation
  const valueAsFloat = parseFloat(cleanedValue);

  // Slide any extra decimals down to 2
  const fixedDecimal = valueAsFloat.toFixed(2);

  // Add in commas to delineate thousands (if needed)
  cleanedValue = Number(fixedDecimal).toLocaleString("en");
  return cleanedValue.toString();
}

/**
 * Splits a string with a : and converts each side to a comma-separated string
 * @param {String} value
 * @returns {String}
 */
export function convertToRatioString(value: string): string {
  // Clean value
  const cleanedInput = cleanRatioInput(value);
  if (!cleanedInput.isValid) return value;

  // Grab the left and right side of the ratio sign
  const values = cleanedInput.cleanedValue.split(":");

  // Create the left side of the output and make the number (if provided) pretty
  values[0] = convertToThousandsSeparatedString(values[0]);

  // Create the right side of the output and make the number (if provided) pretty
  values[1] = convertToThousandsSeparatedString(values[1]);

  const cleanedValue = values.join(":");
  return cleanedValue;
}

// if valid custom mask, return masked value; else return value
export const applyMask = (
  value: string,
  maskName?: keyof typeof maskMap | null
): string => {
  // if maskName is specified as null, bypass all masking and return user-inputted value
  if (maskName === null) return value;

  // to-do: confirm we can remove

  /**
   * if not a valid number, bypass all masking and return user-inputted value
   * const isValidNumber = validNumberRegex.test(value);
   * if (!isValidNumber) return value;
   */

  // apply specified mask or default to comma-separated mask
  const maskToApply = maskName
    ? maskMap[maskName]
    : convertToThousandsSeparatedString;
  return maskToApply(value);
};
