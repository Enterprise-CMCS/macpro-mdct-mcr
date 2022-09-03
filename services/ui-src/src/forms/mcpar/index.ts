// utils
import { makeReportRoutesArray } from "utils/reports/reports";
import { ReportRoute } from "types";
import mcparReportJson from "./mcpar.json";

export const mcparRoutesFlatArray = makeReportRoutesArray(mcparReportJson);
console.log("mcparRoutesFlatArray", mcparRoutesFlatArray);
export const nonReportMcparRoutes = ["/mcpar/dashboard", "/mcpar/get-started"];

export const isMcparReportPage = (pathname: string) =>
  pathname.includes("/mcpar/") &&
  !nonReportMcparRoutes.find((route: string) => route === pathname);
