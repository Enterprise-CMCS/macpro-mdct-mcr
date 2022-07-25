/*
 * Custom Masks Type Guard
 * Add any future custom masks here!
 */
export type CustomMasks = typeof customMaskMap;
export const isValidCustomMask = (x: any): x is CustomMasks =>
  Object.keys(customMaskMap).includes(x);

export const customMaskMap: any = {
  "comma-separated": convertToCommaSeparatedString,
};
/**
 * Checks if the provided string is contains numbers to mask
 * @param {String} value
 * @returns {String}
 */
export const isValidNumericalString = (value: string): boolean =>
  value?.match(/\d/) ? true : false;

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

  // Remove leading zeroes (we'll add one back later if needed).
  value = value.replace(/^0+/g, "");

  // Convert String to a float to begin operation
  const valueAsFloat = parseFloat(value);

  // Slide any extra decimals down to 2
  const fixedDecimal = valueAsFloat.toFixed(2);

  // Clean up the float value and add in commas to delineate thousands if needed
  const cleanedValue = Number(fixedDecimal).toLocaleString("en");

  return cleanedValue.toString();
}

/**
 * Converts string to the appropriate custom masked format
 * @param {String} value
 * @param {CustomMasks} mask
 * @returns {String}
 */
export function maskValue(value: string, mask: CustomMasks): string {
  const maskToUse = customMaskMap[mask];
  if (isValidNumericalString(value) && maskToUse) {
    return maskToUse(value);
  } else return value;
}
