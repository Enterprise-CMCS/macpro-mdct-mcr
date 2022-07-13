import sectionA_pointofcontact from "./apoc.json";
import sectionA_reportingperiod from "./arp.json";
import sectionA_bssentities from "./abss.json";

export const mcparReportPages = [
  sectionA_pointofcontact,
  sectionA_reportingperiod,
  sectionA_bssentities,
];

export const mcparReportPageOrder = mcparReportPages.map((page) => page.path);
