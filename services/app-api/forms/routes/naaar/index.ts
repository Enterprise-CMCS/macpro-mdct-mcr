// types
import { ReportJsonFile, ReportType } from "../../../utils/types";
// routes
import { planComplianceRoute } from "./plan-compliance";
import { programLevelAccessAndNetworkAdequacyStandardsRoute } from "./program-level-access-and-network-adequacy-standards";
import { reviewAndSubmitRoute } from "./review-and-submit";
import { stateAndProgramInformationRoute } from "./state-and-program-information";

export const ReportJson: ReportJsonFile = {
  type: ReportType.NAAAR,
  name: "NAAAR Report Submission Form",
  basePath: "/naaar",
  version: "NAAAR_2024-08-06",
  entities: {
    plans: {
      required: true,
    },
    analysisMethods: {
      required: true,
    },
    standards: {
      required: true,
    },
  },
  routes: [
    stateAndProgramInformationRoute,
    programLevelAccessAndNetworkAdequacyStandardsRoute,
    planComplianceRoute,
    reviewAndSubmitRoute,
  ],
};
