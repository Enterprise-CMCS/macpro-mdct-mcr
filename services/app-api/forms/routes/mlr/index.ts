// types
import { ReportJsonFile, ReportType } from "../../../utils/types";
// routes
import { mlrReportingRoute } from "./mlr-reporting";
import { informationForPrimaryContactRoute } from "./information-for-primary-contact";
import { reviewAndSubmitRoute } from "./review-and-submit";

export const mlrReportJson: ReportJsonFile = {
  type: ReportType.MLR,
  name: "MLR Report Submission Form",
  basePath: "/mlr",
  version: "MLR_2024-06-10",
  entities: {
    program: {
      required: true,
    },
  },
  routes: [
    informationForPrimaryContactRoute,
    mlrReportingRoute,
    reviewAndSubmitRoute,
  ],
};
