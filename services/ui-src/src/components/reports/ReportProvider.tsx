import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
// types
import {
  ReportKeys,
  ReportContextShape,
  ReportShape,
  ErrorVerbiage,
} from "types";
// utils
import {
  archiveReport as archiveReportRequest,
  releaseReport as releaseReportRequest,
  submitReport as submitReportRequest,
  flattenReportRoutesArray,
  getLocalHourMinuteTime,
  getReport,
  getReportsByState,
  postReport,
  putReport,
  sortReportsOldestToNewest,
  useStore,
} from "utils";
// verbiage
import { reportErrors } from "verbiage/errors";

// CONTEXT DECLARATION

export const ReportContext = createContext<ReportContextShape>({
  // report
  contextIsLoaded: false as boolean,
  archiveReport: Function,
  releaseReport: Function,
  createReport: Function,
  fetchReport: Function,
  updateReport: Function,
  submitReport: Function,
  // reports by state
  fetchReportsByState: Function,
  // selected report
  clearReportSelection: Function,
  clearReportsByState: Function,
  setReportSelection: Function,
  isReportPage: false as boolean,
  errorMessage: undefined,
});

export const ReportProvider = ({ children }: Props) => {
  const { pathname } = useLocation();
  const [error, setError] = useState<ErrorVerbiage | undefined>();
  const [contextIsLoaded, setContextIsLoaded] = useState<boolean>(false);
  const [isReportPage, setIsReportPage] = useState<boolean>(false);

  // state management
  const {
    report,
    reportsByState,
    copyEligibleReportsByState,
    lastSavedTime,
    setReport,
    setReportsByState,
    clearReportsByState,
    setCopyEligibleReportsByState,
    setLastSavedTime,
  } = useStore();
  const { state: userState } = useStore().user ?? {};

  const hydrateAndSetReport = (report: ReportShape | undefined) => {
    if (report) {
      report.formTemplate.flatRoutes = flattenReportRoutesArray(
        report.formTemplate.routes
      );
    }
    setReport(report);
    setContextIsLoaded(true);
  };

  const fetchReport = async (reportKeys: ReportKeys) => {
    try {
      const result = await getReport(reportKeys);
      hydrateAndSetReport(result);
      return result;
    } catch {
      setError(reportErrors.GET_REPORT_FAILED);
      return;
    }
  };

  const fetchReportsByState = async (
    reportType: string,
    selectedState: string
  ) => {
    try {
      // clear stored reports by state prior to fetching from current state
      clearReportsByState();
      const result = await getReportsByState(reportType, selectedState);
      setReportsByState(sortReportsOldestToNewest(result));
    } catch {
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
      hydrateAndSetReport(result);
      setLastSavedTime(getLocalHourMinuteTime());
    } catch {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const submitReport = async (reportKeys: ReportKeys) => {
    try {
      const result = await submitReportRequest(reportKeys);
      setLastSavedTime(getLocalHourMinuteTime());
      hydrateAndSetReport(result);
    } catch {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const updateReport = async (reportKeys: ReportKeys, report: ReportShape) => {
    try {
      const result = await putReport(reportKeys, report);
      hydrateAndSetReport(result);
      setLastSavedTime(getLocalHourMinuteTime());
    } catch {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const archiveReport = async (reportKeys: ReportKeys) => {
    try {
      await archiveReportRequest(reportKeys);
      setLastSavedTime(getLocalHourMinuteTime());
    } catch {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const releaseReport = async (reportKeys: ReportKeys) => {
    try {
      await releaseReportRequest(reportKeys);
    } catch {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  // SELECTED REPORT

  const clearReportSelection = () => {
    hydrateAndSetReport(undefined);
    setLastSavedTime(undefined);
    localStorage.setItem("selectedReport", "");
  };

  const setReportSelection = async (report: ReportShape) => {
    hydrateAndSetReport(report);
    localStorage.setItem("selectedReportType", report.reportType);
    localStorage.setItem("selectedReport", report.id);
    localStorage.setItem(
      "selectedReportBasePath",
      report.formTemplate.basePath
    );
  };

  useEffect(() => {
    const submittedReports = reportsByState?.filter(
      (item) => item.status === "Submitted" && !item.archived
    );
    setCopyEligibleReportsByState(submittedReports);
  }, [reportsByState]);

  useEffect(() => {
    const flatRoutes = report?.formTemplate.flatRoutes ?? [];
    const isReportPage =
      pathname.includes("export") ||
      flatRoutes.some((route) => route.path === pathname);

    setIsReportPage(isReportPage);
  }, [pathname, report?.formTemplate.flatRoutes]);

  // on first mount, if on report page, fetch report
  useEffect(() => {
    const reportType =
      report?.reportType || localStorage.getItem("selectedReportType");
    const state =
      report?.state || userState || localStorage.getItem("selectedState");
    const id = report?.id || localStorage.getItem("selectedReport");
    if (reportType && state && id) {
      fetchReport({ reportType, state, id });
    }
  }, []);

  const providerValue = useMemo(
    () => ({
      // context
      contextIsLoaded,
      // report
      report,
      archiveReport,
      releaseReport,
      fetchReport,
      createReport,
      updateReport,
      submitReport,
      // reports by state
      reportsByState,
      copyEligibleReportsByState,
      fetchReportsByState,
      // selected report
      clearReportSelection,
      clearReportsByState,
      setReportSelection,
      // other
      isReportPage,
      errorMessage: error,
      lastSavedTime,
    }),
    [
      report,
      reportsByState,
      copyEligibleReportsByState,
      isReportPage,
      error,
      lastSavedTime,
    ]
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
