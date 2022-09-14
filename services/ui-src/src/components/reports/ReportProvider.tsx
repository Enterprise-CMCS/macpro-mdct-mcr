import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
// forms
import { isMcparReportFormPage } from "forms/mcpar";
// utils
import {
  ReportDataShape,
  ReportDetails,
  ReportContextShape,
  ReportShape,
} from "types";
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
  reportData: undefined as ReportDataShape | undefined,
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
  const [reportData, setReportData] = useState<ReportDataShape | undefined>();
  const [reportsByState, setReportsByState] = useState<
    ReportShape[] | undefined
  >();
  const [error, setError] = useState<string>();

  const { pathname } = useLocation();

  // get user state, name, role
  const { user } = useUser();
  const { state } = user ?? {};

  const fetchReportData = async (reportDetails: ReportDetails) => {
    try {
      const result = await getReportData(reportDetails);
      setReportData(result);
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_DATA_FAILED);
    }
  };

  const updateReportData = async (
    reportDetails: ReportDetails,
    fieldData: ReportDataShape
  ) => {
    try {
      await writeReportData(reportDetails, fieldData);
      await fetchReportData(reportDetails);
    } catch (e: any) {
      setError(reportErrors.SET_REPORT_DATA_FAILED);
    }
  };

  const fetchReport = async (reportDetails: ReportDetails) => {
    try {
      const result = await getReport(reportDetails);
      setReport(result);
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_FAILED);
    }
  };

  const updateReport = async (
    reportDetails: ReportDetails,
    reportStatus: ReportShape
  ) => {
    try {
      await writeReport(reportDetails, reportStatus);
      await fetchReport(reportDetails);
    } catch (e: any) {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const removeReport = async (reportDetails: ReportDetails) => {
    try {
      await deleteReport(reportDetails);
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
      const reportDetails = {
        state: report.state,
        reportId: report.reportId,
      };
      fetchReportData(reportDetails);
    }
  }, [report?.reportId]);

  useEffect(() => {
    // get state and reportId from context or storage
    const reportId = report?.reportId || localStorage.getItem("selectedReport");
    const reportState = state || localStorage.getItem("selectedState");

    if (isMcparReportFormPage(pathname) && reportState && reportId) {
      const reportDetails = {
        state: reportState,
        reportId: reportId,
      };
      fetchReport(reportDetails);
      fetchReportData(reportDetails);
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
