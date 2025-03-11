import { AnyObject } from "types";

export function translate(text: string = "", keysToReplace: any = {}) {
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
  replaceKey: string,
  verbiage?: AnyObject,
  name?: string
) => {
  const newVerbiage = { ...verbiage };
  const verbiageKeys = Object.keys(newVerbiage);

  verbiageKeys.forEach((key) => {
    if (typeof newVerbiage[key] === "object") {
      const childKeys = Object.keys(newVerbiage[key]);
      childKeys.forEach((childKey) => {
        newVerbiage[key][childKey] = translate(newVerbiage[key][childKey], {
          [replaceKey]: name,
        });
      });
    } else {
      newVerbiage[key] = translate(newVerbiage[key], {
        [replaceKey]: name,
      });
    }
  });

  return newVerbiage;
};
