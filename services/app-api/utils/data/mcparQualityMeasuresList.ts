import { State } from "../types";

export type Measure = {
  measure_name: string;
};

export type Programs = {
  [key: string]: Measure[];
};

export type MeasureList = {
  [key in State]: Programs;
};

export const mcparQualityMeasuresList: MeasureList = {
  // Alabama
  AL: {},
  // Arkansas
  AR: {},
  // Arizona
  AZ: {},
  // Alaska
  AK: {},
  // California
  CA: {},
  // Colorado
  CO: {},
  // Connecticut
  CT: {},
  // Delaware
  DE: {},
  // Washington, DC
  DC: {},
  // Florida
  FL: {},
  // Georgia
  GA: {},
  // Hawaii
  HI: {},
  // Idaho
  ID: {},
  // Illinois
  IL: {},
  // Indiana
  IN: {},
  // Iowa
  IA: {},
  // Kansas
  KS: {},
  // Kentucky
  KY: {},
  // Louisiana
  LA: {},
  // Maine
  ME: {},
  // Maryland
  MD: {},
  // Massachusetts
  MA: {},
  // Michigan
  MI: {},
  // Minnesotta
  MN: {
    "Minnesota Senior Health Options (MSHO)": [
      {
        measure_name: "MSHO measure 1",
      },
    ],
  },
  // Mississippi
  MS: {},
  // Missouri
  MO: {},
  // Montana
  MT: {},
  // Nebraska
  NE: {},
  // Nevada
  NV: {},
  // New Hampshire
  NH: {},
  // New Jersey
  NJ: {},
  // New Mexico
  NM: {},
  // New York
  NY: {},
  // North Carolina
  NC: {},
  // North Dakota
  ND: {},
  // Ohio
  OH: {},
  // Oklahoma
  OK: {},
  // Oregon
  OR: {},
  // Pennsylvania
  PA: {},
  // Puerto Rico
  PR: {},
  // Rhode Island
  RI: {},
  // South Carolina
  SC: {},
  // South Dakota
  SD: {},
  // Tennessee
  TN: {},
  // Texas
  TX: {},
  // Utah
  UT: {},
  // Vermont
  VT: {},
  // Virginia
  VA: {},
  // Washington
  WA: {},
  // West Virginia
  WV: {},
  // Wisconsin
  WI: {},
  // Wyoming
  WY: {},
};
