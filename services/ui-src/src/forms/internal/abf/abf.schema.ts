import { object } from "yup";
import { date, endDate, text, urlOptional } from "utils/forms/schemas";

export default object({
  "abf-title": text(),
  "abf-description": text(),
  "abf-link": urlOptional(),
  "abf-startDate": date(),
  "abf-endDate": endDate("abf-startDate"),
});
