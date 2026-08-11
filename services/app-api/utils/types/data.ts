import { Choice } from "./formFields";
import { State } from "./other";

export type Measure = {
  measure_name: string;
  measure_identifier?: [Choice];
  measure_identifierCbe?: string;
  measure_identifierCmit?: string;
  measure_identifierDefinition?: string;
};

export type MeasureList = {
  [key in State]: Programs;
};

export type Programs = {
  [key: string]: Measure[];
};
