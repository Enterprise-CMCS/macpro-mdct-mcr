import { ParentRoute } from "../../../../../utils/types";
import { appealsByServiceRoute } from "./appeals-by-service";
import { appealsOverviewRoute } from "./appeals-overview";
import { grievancesByReasonRoute } from "./grievances-by-reason";
import { grievancesByServiceRoute } from "./grievances-by-service";
import { grievancesOverviewRoute } from "./grievances-overview";
import { stateFairHearingsRoute } from "./state-fair-hearings";

export const appealsStateFairHearingsAndGrievancesRoute: ParentRoute = {
  name: "IV: Appeals, State Fair Hearings & Grievances",
  path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances",
  children: [
    appealsOverviewRoute,
    appealsByServiceRoute,
    stateFairHearingsRoute,
    grievancesOverviewRoute,
    grievancesByServiceRoute,
    grievancesByReasonRoute,
  ],
};
