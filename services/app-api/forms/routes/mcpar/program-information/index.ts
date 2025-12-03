import { ParentRoute } from "../../../../utils/types";
import { addBssEntitiesRoute } from "./add-bss-entities";
import { addInLieuOfServicesAndSettingsRoute } from "./add-in-lieu-of-services-and-settings";
import { addPlansRoute } from "./add-plans";
import { pointOfContactRoute } from "./point-of-contact";
import { reportingPeriodRoute } from "./reporting-period";

export const programInformationRoute: ParentRoute = {
  name: "A: Program Information",
  path: "/mcpar/program-information",
  children: [
    pointOfContactRoute,
    reportingPeriodRoute,
    addPlansRoute,
    addBssEntitiesRoute,
    addInLieuOfServicesAndSettingsRoute,
  ],
};
