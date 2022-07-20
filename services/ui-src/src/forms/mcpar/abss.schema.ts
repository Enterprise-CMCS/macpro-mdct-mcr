import { array, object, string } from "yup";

export default object({
  "abss-a8": array()
    .min(1)
    .of(string().required("BSS entity name is required")),
});
