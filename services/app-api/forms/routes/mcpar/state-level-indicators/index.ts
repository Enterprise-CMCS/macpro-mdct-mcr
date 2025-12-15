import { ParentRoute } from "../../../../utils/types";
import { encounterDataReportRoute } from "./encounter-data-report";
import { priorAuthorizationRoute } from "./prior-authorization";
import { programCharacteristicsRoute } from "./program-characteristics";
import { programIntegrityRoute } from "./program-integrity";

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
