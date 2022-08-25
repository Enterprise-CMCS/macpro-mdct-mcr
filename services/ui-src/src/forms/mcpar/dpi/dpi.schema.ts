import { object } from "yup";
import { number, radio, nested, text } from "utils/forms/schemas";

export default object({
  "dpi-1": number(),
  "dpi-2": number(),
  "dpi-3": number(),
  "dpi-4": number(),
  "dpi-5": number(),
  "dpi-6": radio(),
  "dpi-7-o1": nested(
    number,
    "dpi-6",
    "Makes referrals to the Medicaid Fraud Control Unit (MFCU) only"
  ),
  "dpi-7-o2": nested(
    number,
    "dpi-6",
    "Makes referrals to the State Medicaid Agency (SMA) and MFCU concurrently"
  ),
  "dpi-7-o3": nested(
    number,
    "dpi-6",
    "Makes some referrals to the SMA and others directly to the MFCU"
  ),
  "dpi-8": number(),
  "dpi-9": text(),
  "dpi-10": radio(),
});
