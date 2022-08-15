import { object } from "yup";
import { date, endDate, text } from "utils/forms/schemas";

export default object({
  "dash-title": text(),
  "dash-startDate": date(),
  "dash-endDate": endDate("dash-startDate"),
});
