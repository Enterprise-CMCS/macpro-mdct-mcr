import { object, string } from "yup";
import { email, text } from "utils/forms/schemas";

export default object({
  "apoc-a1": string(),
  "apoc-a2a": text(),
  "apoc-a2b": email(),
  "apoc-a3a": text(),
  "apoc-a3b": email(),
  "apoc-a4": string(),
});
