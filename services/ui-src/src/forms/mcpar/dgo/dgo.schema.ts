import { object } from "yup";
import { number } from "utils/forms/schemas";

export default object({
  "dgo-1": number(),
  "dgo-2": number(),
  "dgo-3": number(),
  "dgo-4": number(),
  "dgo-5": number(),
});
