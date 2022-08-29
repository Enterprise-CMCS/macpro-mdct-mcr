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
  "dfp-1": number(),
  "dfp-2": radio(),
  "dfp-2-o5-text": nested(text, "dfp-2", "Other"),
  "dfp-3": text(),
  "dfp-4": radio(),
  "dfp-5-start": nested(date, "dfp-4", "Yes"),
  "dfp-5-end": nested(() => endDate("dfp-5-start"), "dfp-4", "Yes"),
});
