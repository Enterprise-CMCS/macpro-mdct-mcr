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

export const sanitizeArray = (array: any[] = []) => {
  const newArray: any[] = [];

  if (array.length > 0) {
    for (let num = 0; num < array.length; num++) {
      const entry = array[num];

      switch (typeof entry) {
        case "string":
          newArray.push(sanitizeString(entry));
          break;
        case "object":
          if (Array.isArray(entry)) {
            if (entry.length > 0) {
              newArray.push(sanitizeArray(entry));
            } else {
              newArray.push(entry);
            }
          } else {
            newArray.push(sanitizeObject(entry));
          }
          break;
        default:
          newArray.push(entry);
          break;
      }
    }

    return newArray;
  }

  return newArray;
};

// receives object and iterates over it's key-value pairs and sanitizes the values
export const sanitizeObject = (object: any) => {
  if (object) {
    const entries = Object.entries(object);
    const newObject: any = {};

    for (let num = 0; num < entries.length; num++) {
      const entry = entries[num];

      switch (typeof entry[1]) {
        case "string":
          newObject[`${entry[0]}`] = sanitizeString(entry[1]);
          break;
        case "object":
          if (Array.isArray(entry[1])) {
            if (entry[1].length > 0) {
              newObject[`${entry[0]}`] = sanitizeArray(entry[1]);
            } else {
              newObject[`${entry[0]}`] = entry[1];
            }
          } else {
            newObject[`${entry[0]}`] = sanitizeObject(entry[1]);
          }
          break;
        default:
          newObject[`${entry[0]}`] = entry[1];
          break;
      }
    }

    return newObject;
  }

  return object;
};
