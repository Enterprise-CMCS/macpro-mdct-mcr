import { useContext } from "react";
// components
import { Form, Modal, ReportContext } from "components";
// utils
import { FormJson, ReportStatus } from "types";
import {
  calculateDueDate,
  convertDateEtToUtc,
  useUser,
  writeFormTemplate,
} from "utils";
import uuid from "react-uuid";
// form
import formJson from "forms/addEditProgram/addEditProgram.json";
import formSchema from "forms/addEditProgram/addEditProgram.schema";
import { mcparReportJsonNested } from "forms/mcpar";

export const AddEditProgramModal = ({
  activeState,
  selectedReportId,
  selectedReportData,
  modalDisclosure,
}: Props) => {
  const { fetchReportsByState, updateReport } = useContext(ReportContext);
  const { full_name } = useUser().user ?? {};

  // add validation to formJson
  const form: FormJson = formJson;
  form.validation = formSchema;

  const writeProgram = async (formData: any) => {
    // prepare payload
    const programName = formData["aep-programName"];
    const dueDate = calculateDueDate(formData["aep-endDate"]);
    const reportDetails = {
      state: activeState,
      reportId: "",
    };
    const dataToWrite = {
      programName,
      reportingPeriodStartDate: convertDateEtToUtc(formData["aep-startDate"]),
      reportingPeriodEndDate: convertDateEtToUtc(formData["aep-endDate"]),
      dueDate,
      lastAlteredBy: full_name,
    };
    // if an existing program was selected, use that report id
    if (selectedReportId) {
      reportDetails.reportId = selectedReportId;
      // edit existing report
      await updateReport(reportDetails, {
        ...dataToWrite,
      });
    } else {
      // if no program was selected, create new report id
      reportDetails.reportId = uuid();
      // create unique form template id
      const formTemplateId = uuid();
      // create new report
      await updateReport(reportDetails, {
        ...dataToWrite,
        reportType: "MCPAR",
        status: ReportStatus.NOT_STARTED,
        formTemplateId: formTemplateId,
      });
      // save form template
      await writeFormTemplate({
        formTemplateId: formTemplateId,
        formTemplate: mcparReportJsonNested,
        formTemplateVersion: mcparReportJsonNested.version,
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
        heading: selectedReportId ? "Edit Program" : "Add a Program",
        actionButtonText: "Save",
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-edit-program-form"
        id={form.id}
        formJson={form}
        formData={selectedReportData}
        onSubmit={writeProgram}
      />
    </Modal>
  );
};

interface Props {
  activeState: string;
  selectedReportId: string | undefined;
  selectedReportData?: any;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
