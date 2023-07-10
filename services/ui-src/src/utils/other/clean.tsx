// REGEXES

// basic check for all possible characters -- standard number
const validCharactersStandardNumberRegex = new RegExp("/[0-9.,$%\\-]+/");
// basic check for all possible characters -- ratio
const validCharactersRatioNumberRegex = new RegExp("/[0-9.,:]+/");
// at most 1 decimal point
const atMost1DecimalPointRegex = new RegExp("/^[^.]*.?[^.]*$/");
// commas only exist before decimal point
const validCommaLocationRegex = new RegExp("/^[^,]+[,]*[.]*[^,]*$");
// at most 1 $%
const atMost1SpecialCharacterRegex = new RegExp("/[$%]?");
// at most 1 $ at the beginning of the input
const validDollarSignPlacementRegex = new RegExp("/^[$]?[^$%]+$/");
// at most 1 % at the end of the input
const validPercentSignPlacementRegex = new RegExp("/^[^%$]+[%]?$/");
// at most 1 - at the beginning of the input (but after any potential $s)
const validNegativeSignPlacementRegex = new RegExp("/^[$]?[\\-]?[^$%\\-]+$/");
// exactly one ratio character in between other characters
const exactlyOneRatioCharacterRegex = new RegExp("/^[^:]+[:]{1}[^:]+$/");

interface CleanedValue {
  isValid: boolean;
  cleanedValue: string;
}

export const checkStandardNumberInputAgainstRegexes = (
  value: string
): Boolean => {
  //console.log(validCharactersStandardNumberRegex.test(value));
  if (
    !validCharactersStandardNumberRegex.test(value) ||
    !atMost1DecimalPointRegex.test(value) ||
    !validCommaLocationRegex.test(value) ||
    !atMost1SpecialCharacterRegex.test(value) ||
    !validDollarSignPlacementRegex.test(value) ||
    !validPercentSignPlacementRegex.test(value) ||
    !validNegativeSignPlacementRegex.test(value)
  )
    return false;
  return true;
};

export const checkRatioInputAgainstRegexes = (value: string): Boolean => {
  if (
    validCharactersRatioNumberRegex.test(value) ||
    exactlyOneRatioCharacterRegex.test(value)
  )
    return false;
  return true;
};

export const checkLeftSideOfRatioAgainstRegexes = (value: string): Boolean => {
  if (
    validCharactersStandardNumberRegex.test(value) ||
    atMost1DecimalPointRegex.test(value) ||
    validCommaLocationRegex.test(value)
  )
    return false;
  return true;
};

export const checkRightSideOfRatioAgainstRegexes = (value: string): Boolean => {
  if (
    validCharactersStandardNumberRegex.test(value) ||
    atMost1DecimalPointRegex.test(value) ||
    validCommaLocationRegex.test(value)
  )
    return false;
  return true;
};

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
  if (!isValidRatio) return { isValid: false, cleanedValue: value };

  // Grab the left and right side of the ratio sign
  let values = value.split(":");

  // Check left and right side for valid inputs
  if (
    !checkLeftSideOfRatioAgainstRegexes(values[0]) ||
    !checkRightSideOfRatioAgainstRegexes(values[1])
  )
    return { isValid: false, cleanedValue: value };

  // Clean the left side
  const cleanLeft = cleanStandardNumericalInput(values[0]);
  values[0] = cleanLeft.cleanedValue;

  // Clean the right side
  const cleanRight = cleanStandardNumericalInput(values[1]);
  values[1] = cleanRight.cleanedValue;

  const cleanedValue = values.join(":");

  return {
    isValid: true,
    cleanedValue: cleanedValue,
  };
};
