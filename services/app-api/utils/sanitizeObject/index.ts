import { sanitizeString } from "../sanitizeString";

// receives object and iterates over it's key-value pairs and sanitizes the values
export const sanitizeObject = (object: any) => {
  // breaks object into an array
  const entries = Object.entries(object);
  const newObject: any = {};

  for (let index = 0; index < entries.length; index++) {
    const entry: any = entries[index];

    // checks for a string
    if (typeof entry[1] === "string") {
      newObject[`${entry[0]}`] = sanitizeString(entry[1]);
      // checks for an array of strings
    } else if (Array.isArray(entry[1])) {
      const entryValueArray = [];

      for (let ind = 0; ind < entry[1].length; ind++) {
        const item = entry[1][ind];
        entryValueArray.push(sanitizeString(item));
      }

      newObject[`${entry[0]}`] = entryValueArray;
      // checks for anything else
    } else {
      newObject[`${entry[0]}`] = entry[1];
    }
  }

  return newObject;
};
