export function compareText(
  textToMatch: string | boolean | null,
  textToCompare?: string | boolean | null,
  matchText?: string | null,
  nonMatchText?: string | null
) {
  // textToMatch is required, so early return non-match
  if (textToCompare === undefined) {
    return nonMatchText;
  }

  return textToCompare === textToMatch
    ? matchText
    : // return textToCompare only with undefined nonMatchText to allow null nonMatchText
    nonMatchText !== undefined
    ? nonMatchText
    : textToCompare;
}

export function otherSpecify(
  textToCompare?: string | null,
  matchText?: string | null,
  nonMatchText?: string | null
) {
  return compareText("Other, specify", textToCompare, matchText, nonMatchText);
}
