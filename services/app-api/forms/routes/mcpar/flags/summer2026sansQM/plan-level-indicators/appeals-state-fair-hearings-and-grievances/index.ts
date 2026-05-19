import { ParentRoute } from "../../../../../../../utils/types";
import { appealsByReasonRoute } from "./appeals-by-reason";
import { appealsOverviewRoute } from "./appeals-overview";
import { appealsByServiceRoute } from "../../../../plan-level-indicators/appeals-state-fair-hearings-and-grievances/appeals-by-service";
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
    appealsByReasonRoute,
    stateFairHearingsRoute,
    grievancesOverviewRoute,
    grievancesByServiceRoute,
    grievancesByReasonRoute,
  ],
};
