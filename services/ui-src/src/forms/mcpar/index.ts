// structure
import mcparRouteStructure from "./reportStructure";
// utils
import {
  addDataToReportStructure,
  makeReportNavigationOrder,
} from "utils/reports/reports";
// pages/forms
import test from "./atest/test.json";
import sectionA_pointofcontact from "./apoc/apoc.json";
import sectionA_reportingperiod from "./arp/arp.json";

const combinedMcparForms = [
  test,
  sectionA_pointofcontact,
  sectionA_reportingperiod,
  // note: add new forms here as they are created
];

export const mcparRoutes = addDataToReportStructure(
  mcparRouteStructure,
  combinedMcparForms
);
// console.log("created routes", mcparRoutes);

export const mcparPageNavigationOrder = makeReportNavigationOrder(
  mcparRouteStructure,
  "/mcpar"
);
// console.log("mcpar nav order: ", mcparPageNavigationOrder);
