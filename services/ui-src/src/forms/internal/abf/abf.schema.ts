import { object, string, number, ref } from "yup";

export default object({
  "abf-title": string().required("Title text is required"),
  "abf-description": string().required("Description text is required"),
  "abf-link": string().url("URL must be valid"),
  "abf-startDate": number().required("Start date is required"),
  "abf-endDate": number()
    .required("End date is required")
    .min(ref("abf-startDate"), "End date cannot be before start date"),
});
