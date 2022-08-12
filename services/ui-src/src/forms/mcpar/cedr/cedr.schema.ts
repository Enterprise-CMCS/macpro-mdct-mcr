import { object } from "yup";
import { checkbox, nested, text } from "utils/forms/schemas";

export default object({
  "cedr-1": checkbox(),
  "cedr-1-o7-text": nested(text, "cedr-1", "Other"),
  "cedr-2": checkbox(),
  "cedr-2-o5-text": nested(text, "cedr-2", "Other"),
  "cedr-3": text(),
  "cedr-4": text(),
  "cedr-5": text(),
  "cedr-6": text(),
});
