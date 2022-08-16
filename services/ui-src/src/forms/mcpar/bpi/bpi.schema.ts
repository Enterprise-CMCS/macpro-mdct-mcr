import { object } from "yup";
import { nested, radio, text } from "utils/forms/schemas";

export default object({
  "bpi-1": text(),
  "bpi-2": radio(),
  "bpi-3": text(),
  "bpi-4": text(),
  "bpi-5": text(),
  "bpi-6": text(),
  "bpi-7a": radio(),
  "bpi-7b": nested(radio, "bpi-7a", "Yes"),
  "bpi-7c": nested(text, "bpi-7b", "Yes"),
  "bpi-8a": radio(),
  "bpi-8b": nested(text, "bpi-8a", "Yes"),
  "bpi-9a": radio(),
  "bpi-9b": nested(text, "bpi-9a", "Yes"),
  "bpi-10": text(),
});
