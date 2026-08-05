// constants
import { states } from "../constants/constants";
import * as qualityMeasures from "./qualityMeasures";
// types
import { MeasureList } from "../types";

export const mcparQualityMeasuresList = states.reduce((obj, state) => {
  obj[state] = qualityMeasures[state] ?? {};
  return obj;
}, {} as MeasureList);
