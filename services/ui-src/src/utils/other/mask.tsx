export const customMaskMap = {
  "comma-separated": convertToCommaSeparatedString,
  percentage: convertToCommaSeparatedString,
  ratio: convertToCommaSeparatedRatioString,
};

// returns whether a given mask is a valid custom mask
export const validCustomMask = (maskName: string | undefined) => {
  const result = Object.keys(customMaskMap).includes(maskName!)
    ? maskName
    : undefined;
  return result;
};

// if mask specified, but not a custom mask, return mask as assumed CMSDS mask
export const validCmsdsMask = (maskName: string | undefined) => {
  const result = validCustomMask(maskName) ? undefined : maskName;
  return result;
};

/**
 * checks if provided string contains only numbers
 * @param {String} value
 * @returns {Boolean}
 */
export const isValidNumericalString = (value: string): boolean => {
  return !!value?.toString().match(/\d/);
};

/**
 * Converts a number-like string to a comma seperated value
 * @param {String} value
 * @returns {String}
 */
export function convertToCommaSeparatedString(value: string): string {
  // Remove all characters except digits and decimal points.
  value = value.replace(/[^\d.]/g, "");
  // Remove all but the first decimal point.
  const firstDecimalPointIndex = value.indexOf(".");
  value = value.replace(/[.]/g, (match, index) => {
    return index > firstDecimalPointIndex ? "" : match;
  });
  if (parseFloat(value) !== 0) {
    // Remove all leading zeroes if value is not equal to 0
    value = value.replace(/^0+/g, "");
  }
  // Convert String to a float to begin operation
  const valueAsFloat = parseFloat(value);
  // Slide any extra decimals down to 2
  const fixedDecimal = valueAsFloat.toFixed(2);
  // Clean up the float value and add in commas to delineate thousands if needed
  const cleanedValue = Number(fixedDecimal).toLocaleString("en");
  return cleanedValue.toString();
}

/**
 * Splits a string with a : and converts each side to a comma-separated string
 * @param {String} value
 * @returns {String}
 */
export function convertToCommaSeparatedRatioString(value: string): string {
  // Remove all characters except digits and decimal points.
  value = value.replace(/[^\d.:]/g, "");

  // Grab the left and right side of the ratio sign
  const values = value.split(":");

  // Begin creating the final output
  let cleanedValue = "";

  // Create the left side of the output and make the number (if provided) pretty
  if (values[0] != "") cleanedValue += convertToCommaSeparatedString(values[0]);
  else cleanedValue += "";

  // Put in the ratio sign in the middle of the two numbers
  cleanedValue += ":";

  // Create the right side of the output and make the number (if provided) pretty
  if (values.length >= 2 && values[1] != "")
    cleanedValue += convertToCommaSeparatedString(values[1]);
  else cleanedValue += "";

  return cleanedValue;
}

/**
 * Converts string to the appropriate custom masked format
 * @param {String} value
 * @returns {String}
 */
export function maskValue(
  value: string,
  mask: keyof typeof customMaskMap
): string {
  const selectedCustomMask = customMaskMap[mask];
  if (isValidNumericalString(value) && selectedCustomMask) {
    return selectedCustomMask(value);
  } else return value;
}

// if valid custom mask, return masked value; else return value
export const applyCustomMask = (value: any, maskName: any): string => {
  let formattedValue: string;
  if (value && validCustomMask(maskName)) {
    formattedValue = maskValue(value, maskName);
  } else formattedValue = value;
  return formattedValue.toString();
};
