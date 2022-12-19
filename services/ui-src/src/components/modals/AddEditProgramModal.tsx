import { useContext, useState } from "react";
// components
import { Form, Modal, ReportContext } from "components";
import { Spinner } from "@cmsgov/design-system";
// form
import formJson from "forms/addEditProgram/addEditProgram.json";
// utils
import { AnyObject, FormJson, ReportJson, ReportStatus } from "types";
import { States } from "../../constants";
import {
  calculateDueDate,
  convertDateEtToUtc,
  convertDateUtcToEt,
  useUser,
} from "utils";

export const AddEditProgramModal = ({
  activeState,
  selectedReport,
  formTemplate,
  reportType,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState, updateReport } =
    useContext(ReportContext);
  const { full_name } = useUser().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);
  const form: FormJson = formJson;

  const writeProgram = async (formData: any) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");

    // prepare payload
    const programName = formData["programName"];
    const dueDate = calculateDueDate(formData["reportingPeriodEndDate"]);
    const combinedData = formData["combinedData"] || false;
    const reportingPeriodStartDate = convertDateEtToUtc(
      formData["reportingPeriodStartDate"]
    );
    const reportingPeriodEndDate = convertDateEtToUtc(
      formData["reportingPeriodEndDate"]
    );

    const dataToWrite = {
      metadata: {
        programName,
        reportingPeriodStartDate,
        reportingPeriodEndDate,
        dueDate,
        combinedData,
        lastAlteredBy: full_name,
      },
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
        metadata: {
          ...dataToWrite.metadata,
          status: ReportStatus.NOT_STARTED,
        },
      });
    } else {
      // create new report
      await createReport(activeState, {
        ...dataToWrite,
        metadata: {
          ...dataToWrite.metadata,
          reportType,
          status: ReportStatus.NOT_STARTED,
        },
        fieldData: {
          ...dataToWrite.fieldData,
          stateName: States[activeState as keyof typeof States],
        },
        formTemplate,
      });
    }
    await fetchReportsByState(activeState);
    setSubmitting(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      data-testid="add-edit-program-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: selectedReport?.id ? "Edit Program" : "Add a Program",
        actionButtonText: submitting ? <Spinner size="small" /> : "Save",
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-edit-program-form"
        id={form.id}
        formJson={form}
        formData={selectedReport?.fieldData}
        onSubmit={writeProgram}
      />
    </Modal>
  );
};

interface Props {
  activeState: string;
  formTemplate: ReportJson;
  reportType: string;
  selectedReport?: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
