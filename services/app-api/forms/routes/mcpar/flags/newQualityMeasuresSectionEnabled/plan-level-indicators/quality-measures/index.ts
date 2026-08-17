import { ParentRoute } from "../../../../../../../utils/types";
import { instructionsRoute } from "./instructions";
import { newPlanExemptionRoute } from "./new-plan-exemption";
import { measuresAndResultsRoute } from "./measures-and-results";

// Launching in Summer 2026
export const qualityMeasuresRoute: ParentRoute = {
  name: "VII: Quality Measures",
  path: "/mcpar/plan-level-indicators/quality-measures",
  children: [instructionsRoute, newPlanExemptionRoute, measuresAndResultsRoute],
};
