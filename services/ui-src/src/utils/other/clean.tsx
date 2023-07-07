// TO-DO: fix regexes
const validStandardNumberRegex = new RegExp(""); // digits (0-9), any number of commas (,), at most one of $%-.
const validRatioRegex = new RegExp(""); // at most one :.

interface CleanedValue {
  isValid: boolean;
  cleanedValue: string;
}

export const cleanStandardNumericalInput = (value: string): CleanedValue => {
  const isValidNumber = validStandardNumberRegex.test(value);
  if (!isValidNumber) return { isValid: false, cleanedValue: value };

  // Remove all characters except digits and decimal points.
  value = value.replace(/[^\d.]/g, "");

  // TO-DO: since we're only accepting at most one decimal, change logic?

  // Remove all but the first decimal point.
  const firstDecimalPointIndex = value.indexOf(".");
  value = value.replace(/[.]/g, (match, index) => {
    return index > firstDecimalPointIndex ? "" : match;
  });
  if (parseFloat(value) !== 0) {
    // Remove all leading zeroes if value is not equal to 0
    value = value.replace(/^0+/g, "");
  }

  return {
    isValid: true,
    cleanedValue: value,
  };
};

export const cleanRatioInput = (value: string): CleanedValue => {
  const isValidRatio = validRatioRegex.test(value);
  if (!isValidRatio) return { isValid: false, cleanedValue: value };

  // Remove all characters except digits and decimal points.
  value = value.replace(/[^\d.:]/g, "");

  // Grab the left and right side of the ratio sign
  let values = value.split(":");

  // Create the left side of the output and make the number (if provided) pretty
  const cleanLeft = cleanStandardNumericalInput(values[0]);
  if (!cleanLeft.isValid) return { isValid: false, cleanedValue: value };
  values[0] = cleanLeft.cleanedValue;

  // Create the right side of the output and make the number (if provided) pretty
  if (values.length >= 2 && values[1] != "") {
    const cleanRight = cleanStandardNumericalInput(values[1]);
    if (!cleanRight.isValid) return { isValid: false, cleanedValue: value };
    values[1] = cleanRight.cleanedValue;
  }

  const cleanedValue = values.join(":");

  return {
    isValid: true,
    cleanedValue: cleanedValue,
  };
};
