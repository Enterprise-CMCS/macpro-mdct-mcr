import { object } from "yup";
import { checkboxOptional, date, endDate, text } from "utils/forms/schemas";

export default object({
  "aep-programName": text(),
  "aep-startDate": date(),
  "aep-endDate": endDate("aep-startDate"),
  "aep-check": checkboxOptional(),
});
