import { object, string, array } from "yup";

export default object({
  test1: array()
    .required("Field is required")
    .min(1, "Must make at least one selection"),
  "test1-o1-c": array().when("test1", {
    is: (value: any) => value && value.indexOf("option1") != -1,
    then: (schema: any) =>
      schema
        .required("Field is required")
        .min(1, "Must make at least one selection"),
  }),
  "test1-o1-c-o1-c": string().when("test1-o1-c", {
    is: (value: any) => value && value.indexOf("option1-1") != -1,
    then: (schema: any) => schema.required("Field is required"),
  }),
});
