import { object } from "yup";
import { number, radio, nested, text } from "utils/forms/schemas";

export default object({
  "dpi-1": number(),
  "dpi-2": number(),
  "dpi-3": number(),
  "dpi-4": number(),
  "dpi-5": number(),
  "dpi-6": radio(),
  "dpi-7a": nested(
    number,
    "dpi-6",
    "Makes referrals to the Medicaid Fraud Control Unit (MFCU) only"
  ),
  "dpi-7b": nested(
    number,
    "dpi-6",
    "Makes referrals to the State Medicaid Agency (SMA) and MFCU concurrently"
  ),
  "dpi-7c": nested(
    number,
    "dpi-6",
    "Makes some referrals to the SMA and others directly to the MFCU"
  ),
  "dpi-8": number(),
  "dpi-9": text(),
  "dpi-10": radio(),
});
