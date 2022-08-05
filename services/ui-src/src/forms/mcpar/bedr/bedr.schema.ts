import { object } from "yup";
import { checkbox, radio, text } from "utils/forms/schemas";

export default object({
  "bedr-1": checkbox(),
  "bedr-2": radio("bedr-1", "Proprietary system(s)"),
  "bedr-1-o7-text": text("bedr-1", "Other, specify"),
});
