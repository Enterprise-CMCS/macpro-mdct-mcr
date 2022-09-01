import { object } from "yup";
import {
  email,
  emailOptional,
  radio,
  nested,
  text,
  textOptional,
} from "utils/forms/schemas";

// TODO: change to required fields after prefilled fields are functional
export default object({
  "apoc-r1": radio(),
  "apoc-r2": nested(radio, "apoc-r1", "Yes"),
  "apoc-r3": nested(text, "apoc-r2", "Yes"),
  "apoc-a1": textOptional(),
  "apoc-a2a": text(),
  "apoc-a2b": email(),
  "apoc-a3a": textOptional(),
  "apoc-a3b": emailOptional(),
  "apoc-a4": textOptional(),
});
