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
  const translateRecursively = (value: AnyObject): AnyObject | string => {
    if (Array.isArray(value)) {
      return value.map((item) => translateRecursively(item));
    } else if (typeof value === "object" && value !== null) {
      return Object.keys(value).reduce((verbiageObject, childKey) => {
        verbiageObject[childKey] = translateRecursively(value[childKey]);
        return verbiageObject;
      }, {} as AnyObject);
    } else {
      return translate(value, keysToReplace);
    }
  };

  return Object.keys(verbiage).reduce((verbiageObject, key) => {
    const value = verbiage[key];
    verbiageObject[key] = translateRecursively(value);
    return verbiageObject;
  }, {} as AnyObject);
};
