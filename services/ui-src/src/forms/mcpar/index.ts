import test from "./test.json";
import sectionA_pointofcontact from "./apoc.json";
import sectionA_reportingperiod from "./arp.json";

export const mcparReportPages = [
  test,
  sectionA_pointofcontact,
  sectionA_reportingperiod,
];

export const mcparReportPageOrder = mcparReportPages.map((page) => page.path);
