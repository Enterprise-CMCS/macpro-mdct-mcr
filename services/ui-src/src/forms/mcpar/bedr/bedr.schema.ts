import { object } from "yup";
import { checkbox, nested, radio, text } from "utils/forms/schemas";

export default object({
  "bedr-1": checkbox(),
  "bedr-2": nested(radio, "bedr-1", "Proprietary system(s)"),
  "bedr-1-o7-text": nested(text, "bedr-1", "Other, specify"),
});
