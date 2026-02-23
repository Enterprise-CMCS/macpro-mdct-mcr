// types
import { ReportJsonFile, ReportType } from "../../../utils/types";
// routes
import { bssEntityIndicatorsRoute } from "./bss-entity-indicators";
import { notesRoute } from "./notes";
import { planLevelIndicatorsRoute } from "./plan-level-indicators";
import { programInformationRoute } from "./program-information";
import { programLevelIndicatorsRoute } from "./program-level-indicators";
import { reviewAndSubmitRoute } from "./review-and-submit";
import { stateLevelIndicatorsRoute } from "./state-level-indicators";

// Use with LaunchDarkly flag: mcparFebruary2026
export const mcparReportJson: ReportJsonFile = {
  type: ReportType.MCPAR,
  name: "MCPAR Report Submission Form",
  basePath: "/mcpar",
  version: "MCPAR_2023-03-17",
  entities: {
    sanctions: {
      required: false,
    },
    accessMeasures: {
      required: true,
    },
    qualityMeasures: {
      required: true,
    },
    plans: {
      required: true,
    },
    bssEntities: {
      required: true,
    },
    ilos: {
      required: false,
    },
  },
  routes: [
    programInformationRoute,
    stateLevelIndicatorsRoute,
    programLevelIndicatorsRoute,
    planLevelIndicatorsRoute,
    bssEntityIndicatorsRoute,
    notesRoute,
    reviewAndSubmitRoute,
  ],
};
