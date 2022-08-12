import { object } from "yup";
import { radio, text } from "utils/forms/schemas";

export default object({
  "bpi-1": text(),
  "bpi-2": radio(),
  "bpi-3": text(),
  "bpi-4": text(),
  "bpi-5": text(),
  "bpi-6": text(),
  "bpi-7a": radio(),
  "bpi-8a": radio(),
  "bpi-9a": radio(),
  "bpi-10": text(),
});
