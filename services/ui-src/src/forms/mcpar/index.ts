import test from "./atest/test.json";
import sectionA_pointofcontact from "./apoc/apoc.json";
import sectionA_reportingperiod from "./arp/arp.json";

export const mcparReportPages = [
  test,
  sectionA_pointofcontact,
  sectionA_reportingperiod,
];

export const mcparReportPageOrder = mcparReportPages.map((page) => page.path);

/*
 * console.log("ORDER: ", mcparReportPageOrder);
 * change title of stuff to mcparRoutes
 * make sections: get started, a, b, c, d, e, review/submit
 * compose manually here, conditionally passing along an element
 * create filter that makes a clean tree like in mcparsidenavitems
 */
