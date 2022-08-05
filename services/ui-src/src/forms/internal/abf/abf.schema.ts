import { object } from "yup";
import { text, url, date, endDate } from "utils/forms/schemas";

export default object({
  "abf-title": text(),
  "abf-description": text(),
  "abf-link": url(),
  "abf-startDate": date(),
  "abf-endDate": endDate("abf-startDate"),
});
