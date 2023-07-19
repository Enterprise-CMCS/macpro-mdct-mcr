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
): {
  maskedValue: string;
  cleanedValue: string;
} {
  // Check value validity, and if invalid, bypass all masking and return user-inputted value
  const cleanedInput = cleanStandardNumericalInput(value);
  if (!cleanedInput.isValid) return { maskedValue: value, cleanedValue: value };

  // If valid, take cleaned value and continue to masking
  let cleanedValue = cleanedInput.cleanedValue;

  // Remove all characters except 0123456789.-
  let maskedValue = cleanedValue.replace(/[^\d.-]/g, "");

  if (fixedDecimalPlaces) {
    // Convert String to a float to begin operation
    const valueAsFloat = parseFloat(maskedValue);

    // Slide any extra decimals down to number of fixedDecimalPlaces
    const fixedDecimal = valueAsFloat.toFixed(fixedDecimalPlaces);
    maskedValue = Number(fixedDecimal).toLocaleString("en", {
      minimumFractionDigits: fixedDecimalPlaces,
      maximumFractionDigits: fixedDecimalPlaces,
    });
    return { maskedValue: maskedValue.toString(), cleanedValue: cleanedValue };
  }

  // Add in commas to delineate thousands (if needed)
  maskedValue = Number(maskedValue).toLocaleString("en");
  return { maskedValue: maskedValue.toString(), cleanedValue: cleanedValue };
}

/**
 * Splits a string with a : and converts each side to a comma-separated string
 * @param {String} value
 * @returns {String}
 */
export function convertToThousandsSeparatedRatioString(
  value: string,
  fixedDecimalPlaces?: number | undefined
): {
  maskedValue: string;
  cleanedValue: string;
} {
  // Clean value
  const cleanedInput = cleanRatioInput(value);
  if (!cleanedInput.isValid) return { maskedValue: value, cleanedValue: value };

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
  return { maskedValue: maskedValue, cleanedValue: cleanedInput.cleanedValue };
}

// if valid custom mask, return masked value; else return value
export const applyMask = (
  value: string,
  maskName?: keyof typeof maskMap | null
): {
  maskedValue: string;
  cleanedValue: string;
} => {
  // if maskName is specified as null, bypass all masking and return user-inputted value
  if (maskName === null) return { maskedValue: value, cleanedValue: value };

  // apply specified mask or default to comma-separated mask
  const maskToApply = maskName
    ? maskMap[maskName]
    : convertToThousandsSeparatedString;

  // if currency field, we want to round to 2 decimal places
  return maskName === "currency" ? maskToApply(value, 2) : maskToApply(value);
};
