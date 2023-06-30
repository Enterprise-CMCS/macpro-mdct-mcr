// TO-DO: fix regexes
const validStandardNumberRegex = new RegExp(""); // digits (0-9), any number of commas (,), at most one of $%-.
const validRatioRegex = new RegExp(""); // at most one :.

interface CleanedValue {
  isValid: boolean;
  cleanedValue: string;
}

export function cleanStandardNumericalInput(value: string): CleanedValue {
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
}

export function cleanRatioInput(value: string): CleanedValue {
  const isValidRatio = validRatioRegex.test(value);
  if (!isValidRatio) return { isValid: false, cleanedValue: value };

  // Remove all characters except digits and decimal points.
  value = value.replace(/[^\d.:]/g, "");

  // Grab the left and right side of the ratio sign
  const values = value.split(":");

  // Begin creating the final output
  let cleanedValue = "";

  // Create the left side of the output and make the number (if provided) pretty
  const cleanLeft = cleanStandardNumericalInput(values[0]);
  if (!cleanLeft.isValid) return { isValid: false, cleanedValue: value };

  if (values[0] != "") {
    cleanedValue += cleanStandardNumericalInput(values[0]).cleanedValue;
  } else cleanedValue += "";

  //TO-DO: change to array.join

  // Put in the ratio sign in the middle of the two numbers
  cleanedValue += ":";

  return {
    isValid: true,
    cleanedValue: cleanedValue,
  };
}
