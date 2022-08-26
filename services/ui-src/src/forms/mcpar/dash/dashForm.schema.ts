import { object } from "yup";
import { checkboxOptional, date, endDate, text } from "utils/forms/schemas";

export default object({
  "dash-programName": text(),
  "dash-startDate": date(),
  "dash-endDate": endDate("dash-startDate"),
  "dash-check": checkboxOptional(),
});
