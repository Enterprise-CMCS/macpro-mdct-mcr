import { ParentRoute } from "../../../../../../utils/types";
import { appealsStateFairHearingsAndGrievancesRoute } from "../../../program-level-indicators/appeals-state-fair-hearings-and-grievances";
import { availabilityAndAccessibilityRoute } from "./availability-and-accessibility";
import { bssRoute } from "./bss";
import { encounterDataReportRoute } from "../../../program-level-indicators/encounter-data-report";
import { mentalHealthAndSubstanceUseDisorderParityRoute } from "../../../program-level-indicators/mental-health-and-substance-use-disorder-parity";
import { programCharacteristicsRoute } from "../../../program-level-indicators/program-characteristics";
import { programIntegrityRoute } from "../../../program-level-indicators/program-integrity";

export const programLevelIndicatorsRoute: ParentRoute = {
  name: "C: Program-Level Indicators",
  path: "/mcpar/program-level-indicators",
  children: [
    programCharacteristicsRoute,
    encounterDataReportRoute,
    appealsStateFairHearingsAndGrievancesRoute,
    availabilityAndAccessibilityRoute,
    bssRoute,
    programIntegrityRoute,
    mentalHealthAndSubstanceUseDisorderParityRoute,
  ],
};
