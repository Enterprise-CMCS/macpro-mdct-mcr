import { ParentRoute } from "../../../../utils/types";
import { addPlansRoute } from "./add-plans";
import { analysisMethodsRoute } from "./analysis-methods";
import { providerTypeCoverageRoute } from "./provider-type-coverage";
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
