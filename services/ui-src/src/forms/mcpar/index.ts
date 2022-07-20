// structure
import mcparRouteStructure from "./reportStructure";
// utils
import {
  addDataToReportStructure,
  makeRouteArray,
} from "utils/reports/reports";
// pages/forms
import test from "./atest/test.json";
import sectionA_pointofcontact from "./apoc/apoc.json";
import sectionA_reportingperiod from "./arp/arp.json";
import sectionA_bssentities from "./abss/abss.json";

const combinedMcparForms = [
  test,
  sectionA_pointofcontact,
  sectionA_reportingperiod,
  sectionA_bssentities,
  // note: add new forms here as they are created
];

export const mcparStructureWithData = addDataToReportStructure(
  mcparRouteStructure,
  combinedMcparForms
);

export const mcparRoutes = makeRouteArray(mcparStructureWithData);
