import { ParentRoute } from "../../../../../../../utils/types";
import { measuresAndResultsRoute } from "./measures-and-results";
import { newPlanExemptionRoute } from "./new-plan-exemption";

// Launching in Summer 2026
export const qualityMeasuresRoute: ParentRoute = {
  name: "VII: Quality Measures",
  path: "/mcpar/plan-level-indicators/quality-measures",
  children: [newPlanExemptionRoute, measuresAndResultsRoute],
};
