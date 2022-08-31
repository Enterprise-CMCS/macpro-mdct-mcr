import { object } from "yup";
import {
  checkbox,
  nested,
  number,
  numberNA,
  radio,
  text,
} from "utils/forms/schemas";

export default object({
  // nested checkboxes
  test1: checkbox(),
  "test1-o1-c": nested(checkbox, "test1", "option1"),
  "test1-o1-c-o1-c": nested(text, "test1-o1-c", "option1-1"),
  // nested radios
  test2: radio(),
  "test2-o1-c": nested(radio, "test2", "option1"),
  "test2-o1-c-o1-c": nested(text, "test2-o1-c", "option1-1"),
  // masked number fields
  test3: number(),
  test4: number(),
  test5: number(),
  test6: numberNA(),
});
