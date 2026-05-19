import { ParentRoute } from "../../../../../../utils/types";
import { encounterDataReportRoute } from "../../../state-level-indicators/encounter-data-report";
import { priorAuthorizationRoute } from "./prior-authorization";
import { programCharacteristicsRoute } from "../../../state-level-indicators/program-characteristics";
import { programIntegrityRoute } from "../../../state-level-indicators/program-integrity";

export const stateLevelIndicatorsRoute: ParentRoute = {
  name: "B: State-Level Indicators",
  path: "/mcpar/state-level-indicators",
  children: [
    programCharacteristicsRoute,
    encounterDataReportRoute,
    programIntegrityRoute,
    priorAuthorizationRoute,
  ],
};
