import { useContext, useState, useEffect } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
// components
import { Form, Modal, ReportContext } from "components";
import { Spinner } from "@chakra-ui/react";
// form
import mcparFormJson from "forms/addEditMcparReport/addEditMcparReport.json";
import mcparFormJsonWithoutYoY from "forms/addEditMcparReport/addEditMcparReportWithoutYoY.json";
import mlrFormJson from "forms/addEditMlrReport/addEditMlrReport.json";
// utils
import {
  AnyObject,
  FormField,
  FormJson,
  FormLayoutElement,
  ReportStatus,
} from "types";
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
  reportType,
  modalDisclosure,
}: Props) => {
  const {
    createReport,
    fetchReportsByState,
    updateReport,
    copyEligibleReportsByState,
  } = useContext(ReportContext);
  const { full_name } = useUser().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);
  const yoyCopyFlag = useFlags()?.yoyCopy;

  // get correct form
  const modalFormJsonMap: any = {
    MCPAR: yoyCopyFlag ? mcparFormJson : mcparFormJsonWithoutYoY,
    MLR: mlrFormJson,
  };
  const modalFormJson = modalFormJsonMap[reportType]!;
  const [form, setForm] = useState<FormJson>(modalFormJson);

  useEffect(() => {
    // check if yoy copy field exists in form
    const yoyCopyFieldIndex = form.fields.findIndex(
      (field: FormField | FormLayoutElement) =>
        field.id === "copyFieldDataSourceId"
    );
    if (yoyCopyFieldIndex > -1) {
      // if not creating new report || no reports eligible for copy
      if (selectedReport?.id || !copyEligibleReportsByState?.length) {
        // make deep copy of baseline form, disable yoy copy field, and use copied form
        let tempForm: FormJson = JSON.parse(JSON.stringify(modalFormJson));
        tempForm.fields[yoyCopyFieldIndex].props!.disabled = true;
        setForm(tempForm);
      } else {
        // use the original baseline form
        setForm(modalFormJson);
      }
    }
  }, [selectedReport, copyEligibleReportsByState]);

  // MCPAR report payload
  const prepareMcparPayload = (formData: any) => {
    const programName = formData["programName"];
    const copyFieldDataSourceId = formData["copyFieldDataSourceId"];
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
        copyFieldDataSourceId: copyFieldDataSourceId?.value,
      },
      fieldData: {
        reportingPeriodStartDate: convertDateUtcToEt(reportingPeriodStartDate),
        reportingPeriodEndDate: convertDateUtcToEt(reportingPeriodEndDate),
        programName,
      },
    };
  };

  // MLR report payload
  const prepareMlrPayload = (formData: any) => {
    const programName = formData["programName"];

    return {
      metadata: {
        programName: programName,
        lastAlteredBy: full_name,
        locked: false,
        submissionCount: 0,
        previousRevisions: [],
      },
      fieldData: {
        programName,
      },
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
          locked: undefined,
          status: reportType !== "MLR" ? ReportStatus.IN_PROGRESS : undefined,
          submissionCount: undefined,
          previousRevisions: undefined,
        },
      });
    } else {
      await createReport(reportType, activeState, {
        ...dataToWrite,
        metadata: {
          ...dataToWrite.metadata,
          reportType,
          status: ReportStatus.NOT_STARTED,
          isComplete: false,
        },
        fieldData: {
          ...dataToWrite.fieldData,
          stateName: States[activeState as keyof typeof States],
          submissionCount: reportType === "MLR" ? 0 : undefined,
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
        actionButtonText: submitting ? <Spinner size="md" /> : "Save",
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-edit-report-form"
        id={form.id}
        formJson={form}
        formData={selectedReport?.fieldData}
        onSubmit={writeReport}
        validateOnRender={false}
        dontReset={true}
      />
    </Modal>
  );
};

interface Props {
  activeState: string;
  reportType: string;
  selectedReport?: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
