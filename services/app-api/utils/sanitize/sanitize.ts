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
export const sanitizeArray = (array: any[] = []) => {
  const newArray: any[] = [];

  // checks if array is not empty
  if (array.length > 0) {
    array.forEach((entry: any) => {
      const type = entryType(entry);

      switch (type) {
        case "string":
          newArray.push(sanitizeString(entry));
          break;
        case "array":
          newArray.push(sanitizeArray(entry));
          break;

        case "object":
          newArray.push(sanitizeObject(entry));
          break;
        default:
          newArray.push(entry);
          break;
      }
    });

    return newArray;
  }

  // returns empty array if empty
  return newArray;
};

// receives object and iterates over it's key-value pairs and sanitizes the values
export const sanitizeObject = (object: any) => {
  if (object) {
    const entries = Object.entries(object);
    const newObject: any = {};

    entries.forEach((entry: any) => {
      const type = entryType(entry[1]);

      switch (type) {
        case "string":
          newObject[`${entry[0]}`] = sanitizeString(entry[1]);
          break;
        case "array":
          newObject[`${entry[0]}`] = sanitizeArray(entry[1]);
          break;
        case "object":
          newObject[`${entry[0]}`] = sanitizeObject(entry[1]);
          break;
        default:
          newObject[`${entry[0]}`] = entry[1];
          break;
      }
    });

    return newObject;
  }

  // returns unaltered if not present
  return object;
};
