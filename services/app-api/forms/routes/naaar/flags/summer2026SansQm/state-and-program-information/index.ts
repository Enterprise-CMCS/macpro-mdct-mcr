import { ParentRoute } from "../../../../../../utils/types";
import { analysisMethodsRoute } from "../../../state-and-program-information/analysis-methods";
import { addPlansRoute } from "./add-plans";
import { providerTypeCoverageRoute } from "../../../state-and-program-information/provider-type-coverage";
import { stateInformationAndReportingScenarioRoute } from "./state-information-and-reporting-scenario";

export const stateAndProgramInformationRoute: ParentRoute = {
  name: "I. State and program information",
  path: "/naaar/state-and-program-information",
  children: [
    stateInformationAndReportingScenarioRoute,
    addPlansRoute,
    providerTypeCoverageRoute,
    analysisMethodsRoute,
  ],
};
