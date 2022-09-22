import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const windowEmulator: any = new JSDOM("").window;
const DOMPurify = createDOMPurify(windowEmulator);

// sanitize and parse a string
export const sanitizeString = (string: string) => {
  if (DOMPurify.isSupported) {
    return DOMPurify.sanitize(string);
  }
};

// creates a custom "type"
const entryType = (entry: unknown) => {
  // checks if is an array
  if (Array.isArray(entry) && entry.length > 0) {
    return "array";
  }
  // checks if is an array and is not empty
  if (Array.isArray(entry) && entry.length === 0) {
    return "emptyArray";
  }
  // otherwise it's the default type
  return typeof entry;
};

// receives array and iterates over objects or values and sanitizes each
export const sanitizeArray = (array: any[] = []): any[] => {
  return array.map((entry: any) => {
    const type = entryType(entry);
    const sanitizer = sanitizerMap[type];
    if (sanitizer) {
      return sanitizer(entry);
    }
    return entry;
  });
};

// receives object and iterates over it's key-value pairs and sanitizes the values
export const sanitizeObject = (object: any) => {
  if (object) {
    const entries = Object.entries(object);
    const newObject: any = {};

    entries.forEach((entry: any) => {
      const [key, value] = entry;
      const type = entryType(value);
      const sanitizer = sanitizerMap[type];

      if (sanitizer) {
        return (newObject[key] = sanitizer(value));
      }

      return (newObject[key] = value);
    });

    return newObject;
  }
};

export const sanitizerMap: any = {
  string: sanitizeString,
  array: sanitizeArray,
  object: sanitizeObject,
};
