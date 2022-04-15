/* eslint-disable */
import { RegisterOptions } from "react-hook-form";
interface ControllerRules {
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
}
