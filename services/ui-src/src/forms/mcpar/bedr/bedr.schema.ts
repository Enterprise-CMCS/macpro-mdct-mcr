import { object, string, array } from "yup";

export default object({
  "bedr-1": array()
    .required("Data validation entity is required")
    .min(1, "Must make at least one selection"),
  "bedr-2": array().when("bedr-1", {
    is: (value: any) => value && value.indexOf("Proprietary system(s)") != -1,
    then: (schema: any) =>
      schema
        .required("Field is required")
        .min(1, "Must make at least one selection"),
  }),
  "bedr-1-o7-text": string().when("bedr-1", {
    is: (value: any) => value && value.indexOf("Other, specify") != -1,
    then: (schema: any) => schema.required("Field is required"),
  }),
});
