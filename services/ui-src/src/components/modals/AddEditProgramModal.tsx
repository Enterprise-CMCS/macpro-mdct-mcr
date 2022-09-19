import { useContext } from "react";
// components
import { Form, Modal, ReportContext } from "components";
// utils
import { AnyObject, FormJson, ReportStatus } from "types";
import { States } from "../../constants";
import {
  calculateDueDate,
  convertDateEtToUtc,
  convertDateUtcToEt,
  useUser,
} from "utils";
import uuid from "react-uuid";
// form
import formJson from "forms/addEditProgram/addEditProgram.json";
import { mcparReportJson } from "forms/mcpar";

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
    const reportingPeriodStartDate = convertDateEtToUtc(
      formData["aep-startDate"]
    );
    const reportingPeriodEndDate = convertDateEtToUtc(formData["aep-endDate"]);
    const dataToWrite = {
      programName,
      reportingPeriodStartDate,
      reportingPeriodEndDate,
      dueDate,
      lastAlteredBy: full_name,
    };
    // if an existing program was selected, use that report id
    if (selectedReportMetadata?.reportId) {
      const reportKeys = {
        state: activeState,
        reportId: selectedReportMetadata.reportId,
      };
      // edit existing report
      await updateReport(reportKeys, {
        ...dataToWrite,
      });
      await updateReportData(reportKeys, {
        "apoc-a3a": selectedReportMetadata?.submittedBy,
        "apoc-a3b": selectedReportMetadata?.submitterEmail,
        "apoc-a4": selectedReportMetadata?.submittedOnDate,
        "arp-a5a": convertDateUtcToEt(reportingPeriodStartDate),
        "arp-a5b": convertDateUtcToEt(reportingPeriodEndDate),
        "arp-a6": programName,
      });
    } else {
      // if no program was selected, create new report id
      const reportKeys = {
        state: activeState,
        reportId: uuid(),
      };
      // create new report
      await updateReport(reportKeys, {
        ...dataToWrite,
        reportType: "MCPAR",
        status: ReportStatus.NOT_STARTED,
        formTemplate: mcparReportJson,
      });
      await updateReportData(reportKeys, {
        "apoc-a1": stateName,
        "arp-a5a": convertDateUtcToEt(reportingPeriodStartDate),
        "arp-a5b": convertDateUtcToEt(reportingPeriodEndDate),
        "arp-a6": programName,
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
