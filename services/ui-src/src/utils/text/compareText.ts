export function compareText(
  textToMatch: string | boolean | null,
  textToCompare?: string | boolean | null,
  matchText?: string | null,
  nonMatchText?: string | null
) {
  if (textToMatch === textToCompare) return matchText;
  // Allow null nonMatchText
  if (nonMatchText !== undefined) return nonMatchText;
  // nonMatchText undefined
  return textToCompare;
}

export function otherSpecify(
  textToCompare?: string | null,
  matchText?: string | null,
  nonMatchText?: string | null
) {
  return compareText("Other, specify", textToCompare, matchText, nonMatchText);
}
