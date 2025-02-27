import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const windowEmulator: any = new JSDOM("").window;
const DOMPurify = createDOMPurify(windowEmulator);

/*
 * DOMPurify prevents all XSS attacks by default. With these settings, it also
 * prevents "deception" attacks. If an attacker could put <div style="...">
 * into the site's admin banner, they could make give the banner any appearance,
 * overlaid anywhere on the page. For example, a fake "session expired" modal
 * with a malicious link. Thus, this very strict DOMPurify config.
 */
DOMPurify.setConfig({
  // Only these tags will be allowed through
  ALLOWED_TAGS: ["ul", "ol", "li", "a", "#text"],
  // On those tags, only these attributes are allowed
  ALLOWED_ATTR: ["href", "alt"],
  // If a tag is removed, so will all its child elements & text
  KEEP_CONTENT: false,
});

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
