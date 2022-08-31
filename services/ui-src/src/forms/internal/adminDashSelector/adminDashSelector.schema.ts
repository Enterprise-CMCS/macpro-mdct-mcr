import { object } from "yup";
import { dropdown } from "utils/forms/schemas";

export default object({
  "ads-state": dropdown(),
});
