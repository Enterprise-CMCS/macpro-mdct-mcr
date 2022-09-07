import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
// utils
import {
  AnyObject,
  FieldDataShape,
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
} from "utils";
// verbiage
import { reportErrors } from "verbiage/errors";

export const ReportContext = createContext<ReportContextShape>({
  report: undefined as AnyObject | undefined,
  setReport: Function,
  fetchReport: Function,
  updateReport: Function,
  removeReport: Function,
  reportData: undefined as AnyObject | undefined,
  setReportData: Function,
  fetchReportData: Function,
  updateReportData: Function,
  reportsByState: undefined as AnyObject | undefined,
  fetchReportsByState: Function,
  errorMessage: undefined,
});

export const ReportProvider = ({ children }: Props) => {
  const [report, setReport] = useState<ReportShape | undefined>();
  const [reportData, setReportData] = useState<ReportDataShape | undefined>();
  const [reportsByState, setReportsByState] = useState<AnyObject | undefined>(
    undefined
  );
  const [error, setError] = useState<string>();

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
    fieldData: FieldDataShape
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
