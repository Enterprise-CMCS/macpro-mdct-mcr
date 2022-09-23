import { useContext } from "react";
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
  selectedReport,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState, updateReport } =
    useContext(ReportContext);
  const { full_name } = useUser().user ?? {};

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

    const dataToWrite = {
      programName,
      reportingPeriodStartDate,
      reportingPeriodEndDate,
      dueDate,
      lastAlteredBy: full_name,
      combinedData,
      fieldData: {
        reportingPeriodStartDate: convertDateUtcToEt(reportingPeriodStartDate),
        reportingPeriodEndDate: convertDateUtcToEt(reportingPeriodEndDate),
        programName,
      },
    };
    // if an existing program was selected, use that report id
    if (selectedReport?.id) {
      const reportKeys = {
        state: activeState,
        id: selectedReport.id,
      };
      // edit existing report
      await updateReport(reportKeys, {
        ...dataToWrite,
      });
    } else {
      // create new report
      await createReport(activeState, {
        ...dataToWrite,
        reportType: "MCPAR",
        status: ReportStatus.NOT_STARTED,
        formTemplate: mcparReportJson,
        fieldData: {
          ...dataToWrite.fieldData,
          stateName: States[activeState as keyof typeof States],
        },
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
        heading: selectedReport?.id ? "Edit Program" : "Add a Program",
        actionButtonText: "Save",
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-edit-program-form"
        id={form.id}
        formJson={form}
        formData={selectedReport}
        onSubmit={writeProgram}
      />
    </Modal>
  );
};

interface Props {
  activeState: string;
  selectedReport?: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
