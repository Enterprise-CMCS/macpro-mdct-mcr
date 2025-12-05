import { ParentRoute } from "../../../../utils/types";
import { appealsStateFairHearingsAndGrievancesRoute } from "./appeals-state-fair-hearings-and-grievances";
import { encounterDataReportRoute } from "./encounter-data-report";
import { financialPerformanceRoute } from "./financial-performance";
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
    financialPerformanceRoute,
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
