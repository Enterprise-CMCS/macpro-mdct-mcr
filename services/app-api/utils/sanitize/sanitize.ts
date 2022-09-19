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
const entryType = (entry: any) => {
  // checks if is an array
  const type =
    Array.isArray(entry) && entry.length > 0
      ? "array"
      : // checks if is an array and is not empty
      Array.isArray(entry) && entry.length === 0
      ? "emptyArray"
      : // otherwise it's the default type
        typeof entry;
  return type;
};

// receives array and iterates over objects or values and sanitizes each
export const sanitizeArray = (array: any[] = []) => {
  const newArray: any[] = [];

  // checks if array is not empty
  if (array.length > 0) {
    for (let num = 0; num < array.length; num++) {
      const entry = array[num];
      const type = entryType(entry);

      switch (type) {
        case "string":
          newArray.push(sanitizeString(entry));
          break;
        case "array":
          newArray.push(sanitizeArray(entry));
          break;
        case "emptyArray":
          newArray.push(entry);
          break;
        case "object":
          newArray.push(sanitizeObject(entry));
          break;
        default:
          newArray.push(entry);
          break;
      }
    }

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

    for (let num = 0; num < entries.length; num++) {
      const entry: any = entries[num];
      const type = entryType(entry[1]);

      switch (type) {
        case "string":
          newObject[`${entry[0]}`] = sanitizeString(entry[1]);
          break;
        case "array":
          newObject[`${entry[0]}`] = sanitizeArray(entry[1]);
          break;
        case "emptyArray":
          newObject[`${entry[0]}`] = entry[1];
          break;
        case "object":
          newObject[`${entry[0]}`] = sanitizeObject(entry[1]);
          break;
        default:
          newObject[`${entry[0]}`] = entry[1];
          break;
      }
    }

    return newObject;
  }

  // returns unaltered if not present
  return object;
};
