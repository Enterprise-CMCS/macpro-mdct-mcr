import { object } from "yup";
import {
  checkbox,
  date,
  nested,
  number,
  radio,
  text,
  url,
} from "utils/forms/schemas";

export default object({
  "cpc-1": text(),
  "cpc-1-sub": date(),
  "cpc-2": url(),
  "cpc-3": radio(),
  "cpc-3-o5-text": nested(text, "cpc-3", "Other, specify"),
  "cpc-4a": checkbox(),
  "cpc-4a-o5-text": nested(text, "cpc-4", "None of the above"),
  "cpc-4b": text(),
  "cpc-5": number(),
  "cpc-6": text(),
});
