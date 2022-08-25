import { object } from "yup";
import { checkboxOptional, dateOptional, text } from "utils/forms/schemas";

export default object({
  "dash-program-name": text(),
  "dash-startDate": dateOptional(),
  "dash-endDate": dateOptional(),
  "dash-check": checkboxOptional(),
});
