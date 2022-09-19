import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
// forms
import { isMcparReportFormPage } from "forms/mcpar";
// utils
import { AnyObject, ReportKeys, ReportContextShape, ReportShape } from "types";
import {
  getReportData,
  writeReportData,
  getReport,
  getReportsByState,
  writeReport,
  deleteReport,
  sortReportsOldestToNewest,
  useUser,
} from "utils";
// verbiage
import { reportErrors } from "verbiage/errors";

// TYPES AND CONTEXT DECLARATION

export const ReportContext = createContext<ReportContextShape>({
  // report metadata
  report: undefined as ReportShape | undefined,
  setReport: Function, // local useState setter
  fetchReport: Function,
  updateReport: Function,
  removeReport: Function,
  // report field data
  reportData: undefined as AnyObject | undefined,
  setReportData: Function, // local useState setter
  fetchReportData: Function,
  updateReportData: Function,
  // report metadata of all reports for a given state
  reportsByState: undefined as ReportShape[] | undefined,
  fetchReportsByState: Function,
  errorMessage: undefined as string | undefined,
});

// PROVIDER

export const ReportProvider = ({ children }: Props) => {
  const [report, setReport] = useState<ReportShape | undefined>();
  const [reportData, setReportData] = useState<AnyObject | undefined>();
  const [reportsByState, setReportsByState] = useState<
    ReportShape[] | undefined
  >();
  const [error, setError] = useState<string>();

  const { pathname } = useLocation();

  // get user state, name, role
  const { user } = useUser();
  const { state } = user ?? {};

  const fetchReportData = async (reportKeys: ReportKeys) => {
    try {
      const result = await getReportData(reportKeys);
      setReportData(result);
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_DATA_FAILED);
    }
  };

  const updateReportData = async (
    reportKeys: ReportKeys,
    fieldData: AnyObject
  ) => {
    try {
      await writeReportData(reportKeys, fieldData);
      await fetchReportData(reportKeys);
    } catch (e: any) {
      setError(reportErrors.SET_REPORT_DATA_FAILED);
    }
  };

  const fetchReport = async (reportKeys: ReportKeys) => {
    try {
      const result = await getReport(reportKeys);
      setReport(result);
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_FAILED);
    }
  };

  const updateReport = async (
    reportKeys: ReportKeys,
    reportMetadata: ReportShape
  ) => {
    try {
      await writeReport(reportKeys, reportMetadata);
      await fetchReport(reportKeys);
    } catch (e: any) {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const removeReport = async (reportKeys: ReportKeys) => {
    try {
      await deleteReport(reportKeys);
    } catch (e: any) {
      setError(reportErrors.DELETE_REPORT_FAILED);
    }
  };

  const fetchReportsByState = async (state: string) => {
    try {
      const result = await getReportsByState(state);
      setReportsByState(sortReportsOldestToNewest(result));
    } catch (e: any) {
      setError(reportErrors.GET_REPORTS_BY_STATE_FAILED);
    }
  };

  useEffect(() => {
    if (report) {
      const reportKeys = {
        state: report.state,
        reportId: report.reportId,
      };
      fetchReportData(reportKeys);
    }
  }, [report?.reportId]);

  useEffect(() => {
    // get state and reportId from context or storage
    const reportId = report?.reportId || localStorage.getItem("selectedReport");
    const reportState = state || localStorage.getItem("selectedState");

    if (isMcparReportFormPage(pathname) && reportState && reportId) {
      const reportKeys = {
        state: reportState,
        reportId: reportId,
      };
      fetchReport(reportKeys);
      fetchReportData(reportKeys);
    }
  }, []);

  const providerValue = useMemo(
    () => ({
      report,
      setReport,
      fetchReport,
      updateReport,
      removeReport,
      reportData,
      setReportData,
      fetchReportData,
      updateReportData,
      reportsByState,
      fetchReportsByState,
      errorMessage: error,
    }),
    [report, reportData, reportsByState, error]
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
