import { AnyObject } from "types";

export function translate(
  text: string = "",
  keysToReplace: { [key: string]: string } = {}
) {
  const keys = Object.keys(keysToReplace);
  let translatedText = text;

  keys.forEach((key) => {
    const matches = new RegExp(`{{${key}}}`, "gm");
    translatedText = translatedText.replace(matches, keysToReplace[key]);
  });

  const unmatched = /{{\w*}}/gm;
  translatedText = translatedText.replace(unmatched, "");

  return translatedText;
}

export const translateVerbiage = (
  verbiage: AnyObject = {},
  keysToReplace: { [key: string]: string } = {}
) => {
  const translateRecursively = (value: AnyObject) => {
    if (typeof value === "object" && value !== null) {
      return Object.keys(value).reduce((acc, childKey) => {
        acc[childKey] = translateRecursively(value[childKey]);
        return acc;
      }, {} as AnyObject);
    } else {
      return translate(value, keysToReplace);
    }
  };

  return Object.keys(verbiage).reduce((acc, key) => {
    const value = verbiage[key];
    acc[key] = translateRecursively(value);
    return acc;
  }, {} as AnyObject);
};
