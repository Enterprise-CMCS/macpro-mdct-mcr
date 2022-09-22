import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const windowEmulator: any = new JSDOM("").window;
const DOMPurify = createDOMPurify(windowEmulator);

// sanitize string
export const sanitizeString = (string: string) => {
  if (DOMPurify.isSupported) {
    return DOMPurify.sanitize(string);
  }
};

// iterates over array items, sanitizing items recursively
export const sanitizeArray = (array: unknown[]): unknown[] =>
  array.map((entry: unknown) => sanitizeEntry(entry));

// iterates over object key-value pairs, sanitizing values recursively
export const sanitizeObject = (object: { [key: string]: unknown }) => {
  if (object) {
    const entries = Object.entries(object);
    const sanitizedEntries = entries.map((entry: [string, unknown]) => {
      const [key, value] = entry;
      return [key, sanitizeEntry(value)];
    });
    return Object.fromEntries(sanitizedEntries);
  }
};

const sanitizerMap: any = {
  string: sanitizeString,
  array: sanitizeArray,
  object: sanitizeObject,
};

// return sanitized entry, or if safe type, return entry
const sanitizeEntry = (entry: unknown) => {
  const entryType = Array.isArray(entry) ? "array" : typeof entry;
  const sanitizer = sanitizerMap[entryType];
  return sanitizer?.(entry) || entry;
};
