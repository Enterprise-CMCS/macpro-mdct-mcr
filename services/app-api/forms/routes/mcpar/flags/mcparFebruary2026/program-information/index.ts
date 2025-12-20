import { ParentRoute } from "../../../../../../utils/types";
import { addBssEntitiesRoute } from "../../../program-information/add-bss-entities";
import { addInLieuOfServicesAndSettingsRoute } from "./add-in-lieu-of-services-and-settings";
import { addPlansRoute } from "../../../program-information/add-plans";
import { pointOfContactRoute } from "../../../program-information/point-of-contact";
import { reportingPeriodRoute } from "../../../program-information/reporting-period";

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
