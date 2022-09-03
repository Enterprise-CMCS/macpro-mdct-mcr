import { object } from "yup";
import { date, endDate, text, urlOptional } from "utils/forms/schemas";

export default object({
  "aab-title": text(),
  "aab-description": text(),
  "aab-link": urlOptional(),
  "aab-startDate": date(),
  "aab-endDate": endDate("aab-startDate"),
});
