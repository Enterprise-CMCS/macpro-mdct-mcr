import mcparReportJson from "./mcpar.json";
import mcparReportSchema from "./mcpar.schema";
// utils
import {
  addValidationToReportJson,
  flattenReportRoutesArray,
} from "utils/reports/reports";
import { ReportRoute } from "types";

// update the formJson of each report route with appropriate validation schema
const mcparReportJsonWithValidation = addValidationToReportJson(
  mcparReportJson,
  mcparReportSchema
);

// all mcpar routes, nested
export const mcparRoutesArray = mcparReportJsonWithValidation;

// all mcpar routes, flattened
export const mcparRoutesFlatArray: ReportRoute[] = flattenReportRoutesArray(
  mcparReportJsonWithValidation
);

export const nonFormPages = ["/mcpar/dashboard", "/mcpar/get-started"];
export const isMcparReportFormPage = (pathname: string): boolean =>
  pathname.includes("/mcpar/") && !nonFormPages.includes(pathname);
