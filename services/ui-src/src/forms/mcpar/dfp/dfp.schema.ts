import { object } from "yup";
import {
  date,
  endDate,
  nested,
  number,
  radio,
  text,
} from "utils/forms/schemas";

export default object({
  "dfp-1a": number(),
  "dfp-1b": radio(),
  "dfp-1b-o5-text": nested(text, "dfp-1b", "Other"),
  "dfp-2": text(),
  "dfp-3": radio(),
  "dfp-4-start": nested(date, "dfp-3", "Yes"),
  "dfp-4-end": nested(() => endDate("dfp-4-start"), "dfp-3", "Yes"),
});
