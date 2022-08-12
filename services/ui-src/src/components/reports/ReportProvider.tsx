import { createContext, ReactNode, useMemo, useState } from "react";
// utils
import {
  AnyObject,
  ReportDataShape,
  ReportDetails,
  ReportContextShape,
} from "types";
import {
  getReportData,
  writeReportData,
  getReport,
  getReportsByState,
  writeReport,
} from "utils";
// verbiage
import { reportErrors } from "verbiage/errors";

export const ReportContext = createContext<ReportContextShape>({
  reportStatus: "",
  reportData: undefined as AnyObject | undefined,
  fetchReportData: Function,
  updateReportData: Function,
  fetchReport: Function,
  updateReport: Function,
  errorMessage: undefined,
});

export const ReportProvider = ({ children }: Props) => {
  const [reportStatus, setReportStatus] = useState<string>("");
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
      setReportStatus(result);
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_STATUS_FAILED);
    }
  };

  const fetchReportsByState = async (state: string) => {
    try {
      const result = await getReportsByState(state);
      return result;
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_STATUS_FAILED);
    }
  };

  const updateReport = async (
    reportDetails: ReportDetails,
    reportStatus: string
  ) => {
    try {
      await writeReport(reportDetails, reportStatus);
      await fetchReport(reportDetails);
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
      fetchReport,
      fetchReportsByState,
      updateReport,
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
