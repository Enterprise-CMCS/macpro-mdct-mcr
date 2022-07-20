// structure
import mcparRouteStructure from "./formStructure";
// utils
import {
  addDataToReportStructure,
  makeReportNavigationOrder,
} from "utils/forms/routing";
// pages/forms
import test from "./atest/test.json";
import sectionA_pointofcontact from "./apoc/apoc.json";
import sectionA_reportingperiod from "./arp/arp.json";

export const combinedMcparForms = [
  test,
  sectionA_pointofcontact,
  sectionA_reportingperiod,
];

export const mcparRoutes = addDataToReportStructure(
  mcparRouteStructure,
  combinedMcparForms,
  "/mcpar"
);
// console.log("created routes", mcparRoutes);

export const mcparPageNavigationOrder = makeReportNavigationOrder(
  mcparRouteStructure,
  "/mcpar"
);
// console.log("mcpar nav order: ", mcparPageNavigationOrder);
