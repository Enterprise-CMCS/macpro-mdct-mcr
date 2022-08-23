import { object } from "yup";
import { checkbox, nested, text } from "utils/forms/schemas";

export default object({
  "ebessei-1": checkbox(),
  "ebessei-1-13-text": nested(text, "ebessei-1-o13", "Other"),
  "ebessei-2": checkbox(),
  "ebessei-2-7-text": nested(text, "ebessei-2-o7", "Other"),
});
