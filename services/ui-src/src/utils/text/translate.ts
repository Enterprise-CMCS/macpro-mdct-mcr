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
