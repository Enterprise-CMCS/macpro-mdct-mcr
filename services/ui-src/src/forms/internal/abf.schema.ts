import { object, string } from "yup";

const dateFormatRegex =
  /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})$/;

export default object({
  "abf-title": string().required("Title text is required"),
  "abf-description": string().required("Description text is required"),
  "abf-link": string().url("URL must be valid"),
  "abf-startDate": string()
    .required("Start date is required")
    .matches(dateFormatRegex, "Invalid start date"),
  "abf-endDate": string()
    .required("End date is required")
    .matches(dateFormatRegex, "Invalid end date"),
});
