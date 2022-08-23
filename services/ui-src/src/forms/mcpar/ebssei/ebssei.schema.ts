import { object } from "yup";
import { checkbox, text } from "utils/forms/schemas";

export default object({
  "ebessei-1": checkbox(),
  "ebessei-1-13-text": text(),
  "ebessei-2": checkbox(),
  "ebessei-2-7-text": text(),
});
