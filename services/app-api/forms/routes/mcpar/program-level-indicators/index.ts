import { ParentRoute } from "../../../../utils/types";
import { appealsStateFairHearingsAndGrievancesRoute } from "./appeals-state-fair-hearings-and-grievances";
import { availabilityAndAccessibilityRoute } from "./availability-and-accessibility";
import { bssRoute } from "./bss";
import { encounterDataReportRoute } from "./encounter-data-report";
import { mentalHealthAndSubstanceUseDisorderParityRoute } from "./mental-health-and-substance-use-disorder-parity";
import { mlrReportingRoute } from "./mlr-reporting";
import { programCharacteristicsRoute } from "./program-characteristics";
import { programIntegrityRoute } from "./program-integrity";

export const programLevelIndicatorsRoute: ParentRoute = {
  name: "C: Program-Level Indicators",
  path: "/mcpar/program-level-indicators",
  children: [
    programCharacteristicsRoute,
    mlrReportingRoute,
    encounterDataReportRoute,
    appealsStateFairHearingsAndGrievancesRoute,
    availabilityAndAccessibilityRoute,
    bssRoute,
    programIntegrityRoute,
    mentalHealthAndSubstanceUseDisorderParityRoute,
  ],
};
