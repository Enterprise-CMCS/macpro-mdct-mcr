import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
// utils
import {
  AnyObject,
  ReportDataShape,
  ReportDetails,
  ReportContextShape,
  ReportShape,
} from "types";
import {
  getReportData,
  writeReportData,
  getReport,
  writeReport,
  deleteReport,
} from "utils";
// verbiage
import { reportErrors } from "verbiage/errors";

export const ReportContext = createContext<ReportContextShape>({
  report: undefined as AnyObject | undefined,
  reportData: undefined as AnyObject | undefined,
  setReport: Function,
  setReportData: Function,
  fetchReportData: Function,
  updateReportData: Function,
  fetchReport: Function,
  updateReport: Function,
  removeReport: Function,
  errorMessage: undefined,
});

export const ReportProvider = ({ children }: Props) => {
  const [report, setReport] = useState<ReportShape | undefined>();
  const [reportData, setReportData] = useState<ReportDataShape | undefined>();
  const [error, setError] = useState<string>();

  const fetchReportData = async (reportDetails: ReportDetails) => {
    try {
      const result = await getReportData(reportDetails);
      setReportData(result.reportData);
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_DATA_FAILED);
    }
  };

  const updateReportData = async (
    reportDetails: ReportDetails,
    reportData: ReportDataShape
  ) => {
    try {
      await writeReportData(reportDetails, reportData);
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
      reportData,
      setReport,
      setReportData,
      fetchReportData,
      updateReportData,
      fetchReport,
      updateReport,
      removeReport,
      errorMessage: error,
    }),
    [report, reportData, error]
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
