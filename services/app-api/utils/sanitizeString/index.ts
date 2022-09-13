import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// sanitize and parse a string
export const sanitizeString = (string: string) => {
  const windowEmulator: any = new JSDOM("").window;
  const DOMPurify = createDOMPurify(windowEmulator);

  if (DOMPurify.isSupported) {
    return DOMPurify.sanitize(string);
  }
};
