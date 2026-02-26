import { ParentRoute } from "../../../../utils/types";
import { mlrReportingRoute } from "../program-level-indicators/mlr-reporting";
import { appealsStateFairHearingsAndGrievancesRoute } from "./appeals-state-fair-hearings-and-grievances";
import { encounterDataReportRoute } from "./encounter-data-report";
import { ilosRoute } from "./ilos";
import { patientAccessApiRoute } from "./patient-access-api";
import { priorAuthorizationRoute } from "./prior-authorization";
import { programCharacteristicsRoute } from "./program-characteristics";
import { programIntegrityRoute } from "./program-integrity";
import { qualityMeasuresRoute } from "./quality-measures";
import { sanctionsRoute } from "./sanctions";

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
