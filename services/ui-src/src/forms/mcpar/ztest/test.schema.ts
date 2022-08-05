import { object } from "yup";
import { checkbox, number, text, radio } from "utils/forms/schemas";

export default object({
  // nested checkboxes example
  test1: checkbox(),
  "test1-o1-c": checkbox("test1", "option1"),
  "test1-o1-c-o1-c": text("test1-o1-c", "option1-1"),
  // nested radios example
  test2: radio(),
  "test2-o1-c": radio("test2", "option1"),
  "test2-o1-c-o1-c": text("test2-o1-c", "option1-1"),
  test3: number(),
  test4: number(),
  test5: number(),
});
