import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
// utils
import { isMcparReportFormPage } from "forms/mcpar";
import {
  getReport,
  getReportsByState,
  postReport,
  putReport,
  sortReportsOldestToNewest,
  useUser,
} from "utils";
import { ReportKeys, ReportContextShape, ReportShape } from "types";
import { reportErrors } from "verbiage/errors";

// CONTEXT DECLARATION

export const ReportContext = createContext<ReportContextShape>({
  // report
  report: undefined as ReportShape | undefined,
  fetchReport: Function,
  createReport: Function,
  updateReport: Function,
  // reports by state
  reportsByState: undefined as ReportShape[] | undefined,
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
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_FAILED);
    }
  };

  const fetchReportsByState = async (selectedState: string) => {
    try {
      const result = await getReportsByState(selectedState);
      setReportsByState(sortReportsOldestToNewest(result));
    } catch (e: any) {
      setError(reportErrors.GET_REPORTS_BY_STATE_FAILED);
    }
  };

  const createReport = async (state: string, report: ReportShape) => {
    try {
      const result = await postReport(state, report);
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
    localStorage.setItem("selectedReport", report.id);
  };

  // on mount, if report page, fetch report
  useEffect(() => {
    const state =
      report?.state || userState || localStorage.getItem("selectedState");
    const id = report?.id || localStorage.getItem("selectedReport");
    if (isMcparReportFormPage(pathname) && state && id) {
      fetchReport({ state, id });
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
