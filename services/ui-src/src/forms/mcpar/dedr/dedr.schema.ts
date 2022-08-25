import { object } from "yup";
import { number, text } from "utils/forms/schemas";

export default object({
  "dedr-1": text(),
  "dedr-2": number(),
  "dedr-3": number(),
});
