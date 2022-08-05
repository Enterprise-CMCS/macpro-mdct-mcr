import { object } from "yup";
import { checkbox, radio, text } from "utils/forms/schemas";

export default object({
  "bedr-1": checkbox(),
  "bedr-2": radio("nested", "bedr-1", "Proprietary system(s)"),
  "bedr-1-o7-text": text("nested", "bedr-1", "Other, specify"),
});
