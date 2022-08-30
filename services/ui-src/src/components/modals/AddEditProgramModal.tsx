import { useContext } from "react";
// components
import { Form, Modal, ReportContext } from "components";
// utils
import { AnyObject, ReportStatus } from "types";
import {
  calculateDueDate,
  convertDateEtToUtc,
  convertDateUtcToEt,
  useUser,
} from "utils";
// form
import formJson from "forms/internal/aep/addEditProgram.json";
import formSchema from "forms/internal/aep/addEditProgram.schema";

export const AddEditProgramModal = ({
  activeState,
  modalDisclosure,
  fetchReportsByState,
}: Props) => {
  const { updateReport } = useContext(ReportContext);
  const { full_name } = useUser().user ?? {};
  const {
    addEditProgramModalIsOpen: isOpen,
    addEditProgramOnCloseHandler: onCloseHandler,
  } = modalDisclosure;

  const createReportId = (
    activeState: string,
    programName: string,
    dueDate: number
  ) => {
    const dueDateString = convertDateUtcToEt(dueDate)
      .toString()
      .replace(/\//g, "-");
    const reportId = [activeState, programName, dueDateString].join("_");
    return reportId;
  };

  const addEditProgram = async (formData: any) => {
    // guard against no activeState
    if (activeState) {
      // gather new program details
      const programName = formData["dash-programName"];
      const dueDate = calculateDueDate(formData["dash-endDate"]);
      const reportDetails = {
        state: activeState,
        reportId: createReportId(activeState, programName, dueDate),
      };
      // write report details
      await updateReport(reportDetails, {
        status: ReportStatus.NOT_STARTED,
        programName,
        reportType: "MCPAR",
        reportingPeriodStartDate: convertDateEtToUtc(
          formData["dash-startDate"]
        ),
        reportingPeriodEndDate: convertDateEtToUtc(formData["dash-endDate"]),
        dueDate: dueDate,
        lastAlteredBy: full_name,
      });
      await fetchReportsByState(activeState!);
    }
    onCloseHandler();
  };

  return (
    <Modal
      data-testid="add-edit-program-modal"
      formId={formJson.id}
      modalState={{
        isOpen: isOpen,
        onClose: onCloseHandler,
      }}
      content={{
        heading: "Add a Program",
        actionButtonText: "Save",
        closeButtonText: "Close",
      }}
    >
      <Form
        id={formJson.id}
        formJson={formJson}
        formSchema={formSchema}
        onSubmit={addEditProgram}
      />
    </Modal>
  );
};

interface Props {
  activeState: string | undefined;
  modalDisclosure: AnyObject;
  fetchReportsByState: Function;
}
