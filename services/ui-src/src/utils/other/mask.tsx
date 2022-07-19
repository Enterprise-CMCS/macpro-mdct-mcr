/*
 * Custom Masks Type Guard
 * Add any future custom masks here!
 */
const customMasks = ["comma-seperated"] as const;
export type CustomMasks = typeof customMasks[number];
export const isCustomMask = (x: any): x is CustomMasks =>
  customMasks.includes(x);

/**
 * Checks if the provided string is contains numbers to mask
 * @param {String} value
 * @returns {String}
 */
function isCustomValueMaskable(value: string): boolean {
  if (value && typeof value === "string") {
    const hasDigits = value.match(/\d/);
    if (hasDigits) {
      return true;
    }
  }
  return false;
}

/**
 * Converts a number-like string to a comma seperated value
 * @param {String} value
 * @returns {String}
 */
function toCommaSeperated(value: string): string {
  // Convert String to a float to begin operation
  const valueAsFloat = parseFloat(value);

  // Slide any extra decimals down to 2
  const fixedDecimal = valueAsFloat.toFixed(2);

  // Clean up the float value and add in commas to delineate thousands if needed
  const cleanedValue = Number(fixedDecimal).toLocaleString("en", {
    minimumFractionDigits: 2,
  });

  return `${cleanedValue}`;
}

/**
 * Returns the value with additional masking characters, or the same value back if invalid numeric string
 * @param {String} value
 * @returns {String}
 */
export function customMask(value = "", mask: string): string {
  if (isCustomValueMaskable(value)) {
    if (mask === "comma-seperated") {
      value = toCommaSeperated(value);
    }
  }
  return value;
}
