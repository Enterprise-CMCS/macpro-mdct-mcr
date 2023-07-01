import { createContext, ReactNode, useMemo } from "react";
import { FormTemplateContextShape, ReportType } from "types";
// utils
import {
  compileValidationJsonFromRoutes,
  copyAdminDisabledStatusToForms,
  flattenReportRoutesArray,
} from "utils/reports/reports";
import { assertExhaustive } from "utils";

// Temporary imports - in the future these should come from the API
import rawMcparJson from "../../forms/mcpar/mcpar.json";
import rawMlrJson from "../../forms/mlr/mlr.json";

const jsonForReportType = (reportType: ReportType) => {
  switch (reportType) {
    case ReportType.MCPAR:
      return rawMcparJson;
    case ReportType.MLR:
      return rawMlrJson;
    case ReportType.NAAAR:
      throw new Error(
        "Not Implemented: NAAAR form template JSON must be added to FormTemplateProvider"
      );
    default:
      assertExhaustive(reportType);
      throw new Error(
        "Not Implemented: ReportType not recognized by FormTemplateProvider"
      );
  }
};

const getLatestFormTemplate = (reportType: ReportType) => {
  const rawJson = jsonForReportType(reportType);
  const reportJson = copyAdminDisabledStatusToForms(rawJson);
  const flatRoutes = flattenReportRoutesArray(reportJson.routes);
  const validationJson = compileValidationJsonFromRoutes(flatRoutes);

  return {
    ...reportJson,
    validationJson,
  };
};

export const FormTemplateContext = createContext<FormTemplateContextShape>({
  getLatestFormTemplate,
});

export const FormTemplateProvider = ({ children }: Props) => {
  const providerValue = useMemo(() => {
    return {
      getLatestFormTemplate,
    };
  }, []);

  return (
    <FormTemplateContext.Provider value={providerValue}>
      {children}
    </FormTemplateContext.Provider>
  );
};

interface Props {
  children?: ReactNode;
}
