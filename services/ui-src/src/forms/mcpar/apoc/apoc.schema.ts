import { object } from "yup";
import { email, text, textOptional } from "utils/forms/schemas";

export default object({
  "apoc-a1": textOptional(),
  "apoc-a2a": text(),
  "apoc-a2b": email(),
  "apoc-a3a": text(),
  "apoc-a3b": email(),
  "apoc-a4": textOptional(),
});
