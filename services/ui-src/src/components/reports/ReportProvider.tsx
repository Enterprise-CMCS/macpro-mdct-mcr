import { createContext, ReactNode, useMemo, useState } from "react";
// utils
import {
  AnyObject,
  ReportDataShape,
  ReportDetails,
  ReportContextShape,
  ReportStatusShape,
} from "types";
import {
  getReport,
  writeReport,
  getReportStatus,
  writeReportStatus,
} from "utils";
// verbiage
import { reportErrors } from "verbiage/errors";

export const ReportContext = createContext<ReportContextShape>({
  reportStatus: {} as AnyObject,
  reportData: {} as AnyObject,
  fetchReportData: Function,
  updateReportData: Function,
  fetchReportStatus: Function,
  updateReportStatus: Function,
  errorMessage: undefined,
});

export const ReportProvider = ({ children }: Props) => {
  const [reportStatus, setReportStatus] = useState<ReportStatusShape>({});
  const [reportData, setReportData] = useState<ReportDataShape>({});
  const [error, setError] = useState<string>();

  const fetchReportData = async (reportDetails: ReportDetails) => {
    try {
      const result = await getReport(reportDetails);
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
      await writeReport(reportDetails, reportData);
      await fetchReportData(reportDetails);
    } catch (e: any) {
      setError(reportErrors.SET_REPORT_DATA_FAILED);
    }
  };

  const fetchReportStatus = async (reportDetails: ReportDetails) => {
    try {
      const result = await getReportStatus(reportDetails);
      setReportStatus(result);
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_STATUS_FAILED);
    }
  };

  const updateReportStatus = async (
    reportDetails: ReportDetails,
    reportStatus: string
  ) => {
    try {
      await writeReportStatus(reportDetails, reportStatus);
      await fetchReportStatus(reportDetails);
    } catch (e: any) {
      setError(reportErrors.SET_REPORT_STATUS_FAILED);
    }
  };

  const providerValue = useMemo(
    () => ({
      reportStatus,
      reportData,
      fetchReportData,
      updateReportData,
      fetchReportStatus,
      updateReportStatus,
      errorMessage: error,
    }),
    [reportData, reportStatus, error]
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
