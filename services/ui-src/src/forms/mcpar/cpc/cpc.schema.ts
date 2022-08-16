import { object } from "yup";
import {
  checkbox,
  date,
  nested,
  number,
  radio,
  text,
} from "utils/forms/schemas";

export default object({
  "cpc-1": text(),
  "cpc-1-b": date(),
  "cpc-2": text(),
  "cpc-3": radio(),
  "cpc-3-o5-text": nested(text, "cpc-3", "Other, specify"),
  "cpc-4": checkbox(),
  "cpc-4-o5-text": nested(text, "cpc-4", "None of the above"),
  "cpc-5": text(),
  "cpc-6": number(),
  "cpc-7": text(),
});
