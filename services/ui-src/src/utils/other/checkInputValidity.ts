// REGEX

// basic check for all possible characters -- standard number
const validCharactersStandardNumberRegex = /^[0-9.,$%-]+$/;
// basic check for all possible characters -- ratio
const validCharactersRatioNumberRegex = /^[0-9.,:]+$/;
// at most 1 decimal point
const atMost1DecimalPointRegex = /^[^.]*\.?[^.]*$/;
// commas only exist before decimal point
const validCommaLocationRegex = /^[0-9,$-]*\.?[0-9%]*$/;
// at most 1 $%
const atMost1SpecialCharacterRegex = /^([^$%]*\$[^$%]*|[^$%]*%[^$%]*|[^$%]*)$/;
// at most 1 $ at the beginning of the input
const validDollarSignPlacementRegex = /^[$]?[^$%]+$/;
// at most 1 % at the end of the input
const validPercentSignPlacementRegex = /^[^%$]+%?$/;
// at most 1 - at the beginning of the input (but after any potential $s)
const validNegativeSignPlacementRegex = /^[$]?[-]?[^$%-]+$/;
// exactly one ratio character in between other characters
const exactlyOneRatioCharacterRegex = /^[^:]+:[^:]+$/;

export const checkStandardNumberInputAgainstRegexes = (
  value: string
): boolean => {
  if (
    !validCharactersStandardNumberRegex.test(value) ||
    !atMost1DecimalPointRegex.test(value) ||
    !validCommaLocationRegex.test(value) ||
    !atMost1SpecialCharacterRegex.test(value) ||
    !(
      validDollarSignPlacementRegex.test(value) ||
      validPercentSignPlacementRegex.test(value)
    ) ||
    !validNegativeSignPlacementRegex.test(value)
  )
    return false;
  return true;
};

export const checkRatioInputAgainstRegexes = (
  value: string
): { isValid: boolean; leftSide: string; rightSide: string } => {
  if (
    !validCharactersRatioNumberRegex.test(value) ||
    !exactlyOneRatioCharacterRegex.test(value)
  )
    return { isValid: false, leftSide: "", rightSide: "" };

  // Grab the left and right side of the ratio sign
  let values = value.split(":");

  // Check left and right side for valid inputs
  if (
    !checkLeftSideOfRatioAgainstRegexes(values[0]) ||
    !checkRightSideOfRatioAgainstRegexes(values[1])
  )
    return { isValid: false, leftSide: values[0], rightSide: values[1] };

  return { isValid: true, leftSide: values[0], rightSide: values[1] };
};

export const checkLeftSideOfRatioAgainstRegexes = (value: string): boolean => {
  if (
    validCharactersStandardNumberRegex.test(value) ||
    atMost1DecimalPointRegex.test(value) ||
    validCommaLocationRegex.test(value)
  )
    return false;
  return true;
};

export const checkRightSideOfRatioAgainstRegexes = (value: string): boolean => {
  if (
    validCharactersStandardNumberRegex.test(value) ||
    atMost1DecimalPointRegex.test(value) ||
    validCommaLocationRegex.test(value)
  )
    return false;
  return true;
};
