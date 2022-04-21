/// <reference types="react-scripts" />

import { RegisterOptions } from "react-hook-form";
interface ControllerRules {
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>, // eslint-disable-line no-undef
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
}
