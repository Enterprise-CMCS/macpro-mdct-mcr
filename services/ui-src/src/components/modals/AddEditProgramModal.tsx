import { useContext } from "react";
import uuid from "react-uuid";
// components
import { Form, Modal, ReportContext } from "components";
// form
import formJson from "forms/addEditProgram/addEditProgram.json";
import { mcparReportJson } from "forms/mcpar";
// utils
import { AnyObject, FormJson, ReportStatus } from "types";
import { noCombinedDataInput, States } from "../../constants";
import {
  calculateDueDate,
  convertDateEtToUtc,
  convertDateUtcToEt,
  useUser,
} from "utils";

export const AddEditProgramModal = ({
  activeState,
  selectedReportMetadata,
  modalDisclosure,
}: Props) => {
  const { fetchReportsByState, updateReport, updateReportData } =
    useContext(ReportContext);
  const { full_name } = useUser().user ?? {};

  // get full state name from selected state
  const stateName = States[activeState as keyof typeof States];

  // add validation to formJson
  const form: FormJson = formJson;

  const writeProgram = async (formData: any) => {
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");
    // prepare payload
    const programName = formData["aep-programName"];
    const dueDate = calculateDueDate(formData["aep-endDate"]);
    const combinedDataArray = formData["aep-combinedData"];
    const combinedData = combinedDataArray?.[0] || noCombinedDataInput;
    const reportingPeriodStartDate = convertDateEtToUtc(
      formData["aep-startDate"]
    );
    const reportingPeriodEndDate = convertDateEtToUtc(formData["aep-endDate"]);
    const reportDetails = {
      state: activeState,
      reportId: "",
    };
    const dataToWrite = {
      programName,
      reportingPeriodStartDate: reportingPeriodStartDate,
      reportingPeriodEndDate: reportingPeriodEndDate,
      dueDate,
      lastAlteredBy: full_name,
      combinedData,
    };
    // if an existing program was selected, use that report id
    if (selectedReportMetadata?.reportId) {
      reportDetails.reportId = selectedReportMetadata.reportId;
      // edit existing report
      await updateReport(reportDetails, {
        ...dataToWrite,
      });
      await updateReportData(reportDetails, {
        reportingPeriodStartDate: convertDateUtcToEt(reportingPeriodStartDate),
        reportingPeriodEndDate: convertDateUtcToEt(reportingPeriodEndDate),
        programName: programName,
      });
    } else {
      // if no program was selected, create new report id
      reportDetails.reportId = uuid();
      // create new report
      await updateReport(reportDetails, {
        ...dataToWrite,
        reportType: "MCPAR",
        status: ReportStatus.NOT_STARTED,
        formTemplate: mcparReportJson,
      });
      await updateReportData(reportDetails, {
        stateName: stateName,
        mlrReportingPeriodStartDate: convertDateUtcToEt(
          reportingPeriodStartDate
        ),
        mlrReportingPeriodEndDate: convertDateUtcToEt(reportingPeriodEndDate),
        programName: programName,
      });
    }
    await fetchReportsByState(activeState);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      data-testid="add-edit-program-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: selectedReportMetadata?.reportId
          ? "Edit Program"
          : "Add a Program",
        actionButtonText: "Save",
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-edit-program-form"
        id={form.id}
        formJson={form}
        formData={selectedReportMetadata}
        onSubmit={writeProgram}
      />
    </Modal>
  );
};

interface Props {
  activeState: string;
  selectedReportMetadata?: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
