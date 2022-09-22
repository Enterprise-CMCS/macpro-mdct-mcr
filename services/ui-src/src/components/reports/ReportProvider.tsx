import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
// utils
import { isMcparReportFormPage } from "forms/mcpar";
import {
  getReportMetadata,
  writeReportMetadata,
  deleteReport,
  getReportData,
  writeReportData,
  getReportsByState,
  sortReportsOldestToNewest,
  useUser,
} from "utils";
import {
  AnyObject,
  ReportKeys,
  ReportContextShape,
  ReportMetadata,
} from "types";
import { reportErrors } from "verbiage/errors";

// CONTEXT DECLARATION

export const ReportContext = createContext<ReportContextShape>({
  // report metadata
  reportMetadata: undefined as ReportMetadata | undefined,
  fetchReportMetadata: Function,
  updateReportMetadata: Function,
  removeReport: Function,
  // report field data
  reportData: undefined as AnyObject | undefined,
  fetchReportData: Function,
  updateReportData: Function,
  // report metadata of all reports for a given state
  reportsByState: undefined as ReportMetadata[] | undefined,
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

  // REPORT METADATA

  const [reportMetadata, setReportMetadata] = useState<
    ReportMetadata | undefined
  >();
  const fetchReportMetadata = async (reportKeys: ReportKeys) => {
    try {
      const result = await getReportMetadata(reportKeys);
      setReportMetadata(result);
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_FAILED);
    }
  };
  const updateReportMetadata = async (
    reportKeys: ReportKeys,
    reportMetadata: ReportMetadata
  ) => {
    try {
      await writeReportMetadata(reportKeys, reportMetadata);
      await fetchReportMetadata(reportKeys);
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

  // REPORT FIELD DATA

  const [reportData, setReportData] = useState<AnyObject | undefined>();
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

  // REPORTS BY STATE

  const [reportsByState, setReportsByState] = useState<
    ReportMetadata[] | undefined
  >();
  const fetchReportsByState = async (selectedState: string) => {
    try {
      const result = await getReportsByState(selectedState);
      setReportsByState(sortReportsOldestToNewest(result));
    } catch (e: any) {
      setError(reportErrors.GET_REPORTS_BY_STATE_FAILED);
    }
  };

  // SELECTED REPORT

  const clearReportSelection = () => {
    setReportMetadata(undefined);
    setReportData(undefined);
    localStorage.setItem("selectedReport", "");
  };

  const setReportSelection = async (reportMetadata: ReportMetadata) => {
    setReportMetadata(reportMetadata);
    localStorage.setItem("selectedReport", reportMetadata.reportId);
  };

  // UPDATERS
  const state =
    reportMetadata?.state || userState || localStorage.getItem("selectedState");
  const reportId =
    reportMetadata?.reportId || localStorage.getItem("selectedReport");

  // on mount, if report page, fetch report metadata
  useEffect(() => {
    if (isMcparReportFormPage(pathname) && state && reportId) {
      fetchReportMetadata({ state, reportId });
    }
  }, []);

  // when selected report changes, fetch report field data
  useEffect(() => {
    if (reportMetadata && state && reportId) {
      fetchReportData({ state, reportId });
    }
  }, [reportMetadata?.reportId]);

  const providerValue = useMemo(
    () => ({
      // report metadata
      reportMetadata,
      fetchReportMetadata,
      updateReportMetadata,
      removeReport,
      // report data
      reportData,
      fetchReportData,
      updateReportData,
      // reports by state
      reportsByState,
      fetchReportsByState,
      // selected report
      clearReportSelection,
      setReportSelection,
      errorMessage: error,
    }),
    [reportMetadata, reportData, reportsByState, error]
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
