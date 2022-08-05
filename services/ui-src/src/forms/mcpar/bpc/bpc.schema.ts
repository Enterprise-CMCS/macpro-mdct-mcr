import { object } from "yup";
import { number } from "utils/forms/schemas";

export default object({
  "bpc-1": number(),
  "bpc-2": number(),
});
