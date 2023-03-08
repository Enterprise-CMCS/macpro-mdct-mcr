import { useContext, useState } from "react";
// components
import { Form, Modal, ReportContext } from "components";
import { Spinner } from "@cmsgov/design-system";
// form
import mcparFormJson from "forms/addEditMcparReport/addEditMcparReport.json";
import mlrFormJson from "forms/addEditMlrReport/addEditMlrReport.json";
// utils
import { AnyObject, FormJson, ReportJson, ReportStatus } from "types";
import { States } from "../../constants";
import {
  calculateDueDate,
  convertDateEtToUtc,
  convertDateUtcToEt,
  useUser,
} from "utils";

export const AddEditReportModal = ({
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

  const modalFormJsonMap: any = {
    MCPAR: mcparFormJson,
    MLR: mlrFormJson,
  };

  const modalFormJson = modalFormJsonMap[reportType]!;
  const form: FormJson = modalFormJson;

  // MCPAR report payload
  const prepareMcparPayload = (formData: any) => {
    const programName = formData["programName"];
    const dueDate = calculateDueDate(formData["reportingPeriodEndDate"]);
    const combinedData = formData["combinedData"] || false;
    const reportingPeriodStartDate = convertDateEtToUtc(
      formData["reportingPeriodStartDate"]
    );
    const reportingPeriodEndDate = convertDateEtToUtc(
      formData["reportingPeriodEndDate"]
    );

    return {
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
      formTemplate,
    };
  };

  // MLR report payload
  const prepareMlrPayload = (formData: any) => {
    const programName = formData["programName"];
    return {
      metadata: {
        programName,
        lastAlteredBy: full_name,
      },
      fieldData: {
        programName,
      },
      formTemplate,
    };
  };

  const writeReport = async (formData: any) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");

    const dataToWrite =
      reportType === "MCPAR"
        ? prepareMcparPayload(formData)
        : prepareMlrPayload(formData);

    // if an existing program was selected, use that report id
    if (selectedReport?.id) {
      const reportKeys = {
        reportType: reportType,
        state: activeState,
        id: selectedReport.id,
      };

      // edit existing report
      await updateReport(reportKeys, {
        ...dataToWrite,
        metadata: {
          ...dataToWrite.metadata,
          status: ReportStatus.IN_PROGRESS,
        },
      });
    } else {
      await createReport(reportType, activeState, {
        ...dataToWrite,
        metadata: {
          ...dataToWrite.metadata,
          reportType,
          status: ReportStatus.NOT_STARTED,
          locked: reportType === "MLR" ? false : undefined,
        },
        fieldData: {
          ...dataToWrite.fieldData,
          stateName: States[activeState as keyof typeof States],
          // All new MLR reports are NOT resubmissions by definition.
          versionControl:
            reportType === "MLR"
              ? [
                  {
                    // pragma: allowlist nextline secret
                    key: "versionControl-KFCd3rfEu3eT4UFskUhDtx",
                    value: "No, this is an initial submission",
                  },
                ]
              : undefined,
        },
        formTemplate,
      });
    }
    await fetchReportsByState(reportType, activeState);
    setSubmitting(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      data-testid="add-edit-report-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: selectedReport?.id ? form.heading?.edit : form.heading?.add,
        actionButtonText: submitting ? <Spinner size="small" /> : "Save",
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-edit-report-form"
        id={form.id}
        formJson={form}
        formData={selectedReport?.fieldData}
        onSubmit={writeReport}
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
