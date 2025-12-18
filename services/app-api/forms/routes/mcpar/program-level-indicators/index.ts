import { ParentRoute } from "../../../../utils/types";
import { appealsStateFairHearingsAndGrievancesRoute } from "./appeals-state-fair-hearings-and-grievances";
import { availabilityAndAccessibilityRoute } from "./availability-and-accessibility";
import { bssRoute } from "./bss";
import { encounterDataReportRoute } from "./encounter-data-report";
import { mentalHealthAndSubstanceUseDisorderParityRoute } from "./mental-health-and-substance-use-disorder-parity";
import { mlrRoute } from "./mlr";
import { programCharacteristicsRoute } from "./program-characteristics";
import { programIntegrityRoute } from "./program-integrity";

export const programLevelIndicatorsRoute: ParentRoute = {
  name: "C: Program-Level Indicators",
  path: "/mcpar/program-level-indicators",
  children: [
    programCharacteristicsRoute,
    mlrRoute,
    encounterDataReportRoute,
    appealsStateFairHearingsAndGrievancesRoute,
    availabilityAndAccessibilityRoute,
    bssRoute,
    programIntegrityRoute,
    mentalHealthAndSubstanceUseDisorderParityRoute,
  ],
};
