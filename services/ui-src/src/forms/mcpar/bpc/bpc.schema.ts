import { numberFormatRegex } from "../../../constants";
import { object, string } from "yup";

export default object({
  "bpc-1": string()
    .required("Number field is required")
    .matches(numberFormatRegex, "Please input a number"),
  "bpc-2": string()
    .required("Number field is required")
    .matches(numberFormatRegex, "Please input a number"),
});
