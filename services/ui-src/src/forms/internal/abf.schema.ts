import { object, string } from "yup";
import { dateFormatRegex } from "../../constants";

export default object({
  "abf-title": string().required("Title text is required"),
  "abf-description": string().required("Description text is required"),
  "abf-link": string().url("URL must be valid"),
  "abf-startDate": string()
    .required("Start date is required")
    .matches(dateFormatRegex, "Invalid start date"),
  "abf-endDate": string()
    .required("End date is required")
    .matches(dateFormatRegex, "Invalid start date")
    .test(
      "is after start date",
      "End date cannot be before start date",
      (endDateString, context) => {
        const startDateString = context.parent["abf-startDate"];
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString!);
        return endDate >= startDate;
      }
    ),
});
