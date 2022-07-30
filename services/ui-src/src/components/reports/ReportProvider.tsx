import { createContext, ReactNode, useMemo, useState } from "react";
// utils
import { ReportShape, ReportContextShape } from "types";
import {
  getReport,
  writeReport,
  getReportStatus,
  writeReportStatus,
} from "utils";
// verbiage
import { reportErrors } from "verbiage/errors";

export const ReportContext = createContext<ReportContextShape>({
  reportStatus: "",
  reportData: {},
});

export const ReportProvider = ({ children }: Props) => {
  const [reportStatus, setReportStatus] = useState<any>("");
  const [reportData, setReportData] = useState<ReportShape>({ reportData: {} });
  const [error, setError] = useState<string>();

  const fetchReportData = async () => {
    try {
      const reportKey = "report-key";
      const programName = "program-name";
      const result = await getReport(reportKey, programName);
      setReportData(result);
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_DATA_FAILED);
    }
  };

  const updateReportData = async () => {
    try {
      const reportData = {
        key: "report-key",
        programName: "program-name",
        report: {},
      };
      await writeReport(reportData);
      await fetchReportData();
    } catch (e: any) {
      setError(reportErrors.SET_REPORT_DATA_FAILED);
    }
  };

  const fetchReportStatus = async () => {
    try {
      const reportKey = "report-key";
      const programName = "program-name";
      const result = await getReportStatus(reportKey, programName);
      setReportStatus(result);
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_STATUS_FAILED);
    }
  };

  const updateReportStatus = async () => {
    try {
      const reportData = {
        key: "report-key",
        programName: "program-name",
        report: {},
      };
      await writeReportStatus(reportData);
      await fetchReportStatus();
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
