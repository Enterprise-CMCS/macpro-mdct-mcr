import test from "./atest/test.json";
import sectionA_pointofcontact from "./apoc/apoc.json";
import sectionA_reportingperiod from "./arp/arp.json";

export const mcparReportPages = [
  test,
  sectionA_pointofcontact,
  sectionA_reportingperiod,
];

export const mcparReportPageOrder = mcparReportPages.map((page) => page.path);
