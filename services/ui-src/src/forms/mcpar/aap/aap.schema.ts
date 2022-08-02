import { array, object, string } from "yup";

export default object({
  "aap-1": array()
    .min(1)
    .of(
      string()
        .required("Plan name is required")
        .typeError("Plan name must be a string")
    ),
});
