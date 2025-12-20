import { ParentRoute } from "../../../../../../../utils/types";
import { appealsByServiceRoute } from "../../../../plan-level-indicators/appeals-state-fair-hearings-and-grievances/appeals-by-service";
import { appealsOverviewRoute } from "./appeals-overview";
import { grievancesByReasonRoute } from "../../../../plan-level-indicators/appeals-state-fair-hearings-and-grievances/grievances-by-reason";
import { grievancesByServiceRoute } from "../../../../plan-level-indicators/appeals-state-fair-hearings-and-grievances/grievances-by-service";
import { grievancesOverviewRoute } from "../../../../plan-level-indicators/appeals-state-fair-hearings-and-grievances/grievances-overview";
import { stateFairHearingsRoute } from "../../../../plan-level-indicators/appeals-state-fair-hearings-and-grievances/state-fair-hearings";

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
