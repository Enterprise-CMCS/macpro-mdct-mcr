import { ParentRoute } from "../../../../../../utils/types";
import { appealsStateFairHearingsAndGrievancesRoute } from "./appeals-state-fair-hearings-and-grievances";
import { encounterDataReportRoute } from "../../../plan-level-indicators/encounter-data-report";
import { mlrReportingRoute } from "./mlr-reporting";
import { ilosRoute } from "./ilos";
import { patientAccessApiRoute } from "../../../plan-level-indicators/patient-access-api";
import { priorAuthorizationRoute } from "../../../plan-level-indicators/prior-authorization";
import { programCharacteristicsRoute } from "../../../plan-level-indicators/program-characteristics";
import { programIntegrityRoute } from "../../../plan-level-indicators/program-integrity";
import { qualityMeasuresRoute } from "../../../plan-level-indicators/quality-measures";
import { sanctionsRoute } from "../../../plan-level-indicators/sanctions";

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
