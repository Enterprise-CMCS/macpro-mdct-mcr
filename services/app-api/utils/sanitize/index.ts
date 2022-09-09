import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// sanitize and parse html to react elements
export const sanitize = (string: string) => {
  const windowEmulator: any = new JSDOM("").window;
  const DOMPurify = createDOMPurify(windowEmulator);

  if (DOMPurify.isSupported) {
    return DOMPurify.sanitize(string);
  }
};
