import { object, string, number, ref } from "yup";

export default object({
  "arp-a5a": number().required("Start date is required"),
  "arp-a5b": number()
    .required("End date is required")
    .min(ref("abf-startDate"), "End date cannot be before start date"),
  "arp-a6": string().required(),
});
