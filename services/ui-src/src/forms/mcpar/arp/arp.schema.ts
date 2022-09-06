import { object } from "yup";
import { dateOptional, textOptional } from "utils/forms/schemas";

// TODO: change to required fields after prefilled fields are functional
export default object({
  "arp-a5a": dateOptional(),
  "arp-a5b": dateOptional(),
  "arp-a6": textOptional(),
});
