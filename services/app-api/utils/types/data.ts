import { State } from "./other";

export type Measure = {
  measure_name: string;
  measure_identifier?: any;
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
