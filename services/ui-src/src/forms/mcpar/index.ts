// utils
import { makeReportRoutesFlatArray } from "utils/reports/reports";
import { ReportRoute } from "types";
import mcparReportJson from "./mcpar.json";

export const mcparRoutesFlatArray: ReportRoute[] =
  makeReportRoutesFlatArray(mcparReportJson);
export const mcparRoutesArray = mcparReportJson;

export const nonFormPages = ["/mcpar/dashboard", "/mcpar/get-started"];
export const isReportFormPage = (pathname: string) =>
  pathname.includes("/mcpar/") && !nonFormPages.includes(pathname);
