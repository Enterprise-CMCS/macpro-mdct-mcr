/* eslint-disable no-unused-vars */
interface Measure {
  [year: number]: MeasureMetaData[];
}

export interface MeasureMetaData {
  description: string;
  title: string;
}
