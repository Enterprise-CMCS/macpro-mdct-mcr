import { object } from "yup";
import { checkbox, nested, text } from "utils/forms/schemas";

export default object({
  "ebssei-1": checkbox(),
  "ebssei-1-o13-text": nested(text, "ebssei-1", "Other"),
  "ebssei-2": checkbox(),
  "ebssei-2-o7-text": nested(text, "ebssei-2", "Other"),
});
