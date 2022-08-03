import { numberFormatRegex } from "../../../constants";
import { object, string } from "yup";

export default object({
  "bpc-1": string()
    .required("Field is required")
    .matches(numberFormatRegex, "Please input a number"),
  "bpc-2": string()
    .required("Field is required")
    .matches(numberFormatRegex, "Please input a number"),
});
