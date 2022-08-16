import { object } from "yup";
import { checkboxOptional, date, endDate, text } from "utils/forms/schemas";

export default object({
  "dash-title": text(),
  "dash-contractPeriod": text(),
  "dash-startDate": date(),
  "dash-endDate": endDate("dash-startDate"),
  "dash-check": checkboxOptional(),
});
