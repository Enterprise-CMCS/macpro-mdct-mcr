import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
// utils
import {
  getReport,
  getReportsByState,
  isReportFormPage,
  postReport,
  putReport,
  sortReportsOldestToNewest,
  useUser,
} from "utils";
import {
  ReportKeys,
  ReportContextShape,
  ReportShape,
  ReportMetadataShape,
} from "types";
import { reportErrors } from "verbiage/errors";

// CONTEXT DECLARATION

export const ReportContext = createContext<ReportContextShape>({
  // report
  report: undefined as ReportShape | undefined,
  fetchReport: Function,
  createReport: Function,
  updateReport: Function,
  // reports by state
  reportsByState: undefined as ReportMetadataShape[] | undefined,
  fetchReportsByState: Function,
  // selected report
  clearReportSelection: Function,
  setReportSelection: Function,
  errorMessage: undefined as string | undefined,
});

export const ReportProvider = ({ children }: Props) => {
  const { pathname } = useLocation();
  const { state: userState } = useUser().user ?? {};
  const [error, setError] = useState<string>();

  // REPORT

  const [report, setReport] = useState<ReportShape | undefined>();
  const [reportsByState, setReportsByState] = useState<
    ReportShape[] | undefined
  >();

  const fetchReport = async (reportKeys: ReportKeys) => {
    try {
      const result = await getReport(reportKeys);
      setReport(result);
      return result;
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_FAILED);
    }
  };

  const fetchReportsByState = async (
    reportType: string,
    selectedState: string
  ) => {
    try {
      const result = await getReportsByState(reportType, selectedState);
      setReportsByState(sortReportsOldestToNewest(result));
    } catch (e: any) {
      setError(reportErrors.GET_REPORTS_BY_STATE_FAILED);
    }
  };

  const createReport = async (
    reportType: string,
    state: string,
    report: ReportShape
  ) => {
    try {
      const result = await postReport(reportType, state, report);
      setReport(result);
    } catch (e: any) {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const updateReport = async (reportKeys: ReportKeys, report: ReportShape) => {
    try {
      const result = await putReport(reportKeys, report);
      setReport(result);
    } catch (e: any) {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  // SELECTED REPORT

  const clearReportSelection = () => {
    setReport(undefined);
    localStorage.setItem("selectedReport", "");
  };

  const setReportSelection = async (report: ReportShape) => {
    setReport(report);
    localStorage.setItem("selectedReportType", report.reportType);
    localStorage.setItem("selectedReport", report.id);
    localStorage.setItem(
      "selectedReportBasePath",
      report.formTemplate.basePath
    );
  };

  // on first mount, if on report page, fetch report
  useEffect(() => {
    const reportType =
      report?.reportType || localStorage.getItem("selectedReportType");
    const state =
      report?.state || userState || localStorage.getItem("selectedState");
    const id = report?.id || localStorage.getItem("selectedReport");
    if (isReportFormPage(pathname) && reportType && state && id) {
      fetchReport({ reportType, state, id });
    }
  }, []);

  const providerValue = useMemo(
    () => ({
      // report
      report,
      fetchReport,
      createReport,
      updateReport,
      // reports by state
      reportsByState,
      fetchReportsByState,
      // selected report
      clearReportSelection,
      setReportSelection,
      errorMessage: error,
    }),
    [report, reportsByState, error]
  );

  return (
    <ReportContext.Provider value={providerValue}>
      {children}
    </ReportContext.Provider>
  );
};

interface Props {
  children?: ReactNode;
}
