import { ParentRoute } from "../../../../../../utils/types";
import { appealsStateFairHearingsAndGrievancesRoute } from "../../../plan-level-indicators/appeals-state-fair-hearings-and-grievances";
import { encounterDataReportRoute } from "../../../plan-level-indicators/encounter-data-report";
import { ilosRoute } from "../../../plan-level-indicators/ilos";
import { patientAccessApiRoute } from "../../../plan-level-indicators/patient-access-api";
import { priorAuthorizationRoute } from "../../../plan-level-indicators/prior-authorization";
import { programCharacteristicsRoute } from "../../../plan-level-indicators/program-characteristics";
import { programIntegrityRoute } from "../../../plan-level-indicators/program-integrity";
import { qualityMeasuresRoute } from "./quality-measures";
import { sanctionsRoute } from "../../../plan-level-indicators/sanctions";
import { mlrReportingRoute } from "../../../plan-level-indicators/mlr-reporting";

export const planLevelIndicatorsRoute: ParentRoute = {
  name: "D: Plan-Level Indicators",
  path: "/mcpar/plan-level-indicators",
  children: [
    programCharacteristicsRoute,
    mlrReportingRoute,
    encounterDataReportRoute,
    appealsStateFairHearingsAndGrievancesRoute,
    qualityMeasuresRoute,
    sanctionsRoute,
    programIntegrityRoute,
    ilosRoute,
    priorAuthorizationRoute,
    patientAccessApiRoute,
  ],
};
