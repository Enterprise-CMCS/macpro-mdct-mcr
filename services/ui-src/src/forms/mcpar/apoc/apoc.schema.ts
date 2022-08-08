import { object, string } from "yup";

export default object({
  // "apoc-a1": string().optional(),
  "apoc-a2a": string().required("Contact name is required"),
  "apoc-a2b": string()
    .required("Contact email address is required")
    .email("Email address must be valid"),
  "apoc-a3a": string().required("Submitter name is required"),
  "apoc-a3b": string()
    .required("Submitter email address is required")
    .email("Email address must be valid"),
  // "apoc-a4": string().optional(),
});
