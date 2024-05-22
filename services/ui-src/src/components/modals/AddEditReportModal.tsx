import { useContext, useState, useEffect } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
// components
import { Form, Modal, ReportContext } from "components";
import { Spinner } from "@chakra-ui/react";
// form
import mcparFormJson from "forms/addEditMcparReport/addEditMcparReport.json";
import mcparFormJsonWithoutYoY from "forms/addEditMcparReport/addEditMcparReportWithoutYoY.json";
import mlrFormJson from "forms/addEditMlrReport/addEditMlrReport.json";
// types
import {
  AnyObject,
  FormField,
  FormJson,
  FormLayoutElement,
  ReportStatus,
} from "types";
// utils
import {
  calculateDueDate,
  convertDateEtToUtc,
  convertDateUtcToEt,
  useStore,
} from "utils";
import { States } from "../../constants";

export const AddEditReportModal = ({
  activeState,
  selectedReport,
  reportType,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState, updateReport } =
    useContext(ReportContext);

  // state management
  const { full_name } = useStore().user ?? {};
  const { copyEligibleReportsByState } = useStore();

  const [submitting, setSubmitting] = useState<boolean>(false);

  // LaunchDarkly
  const yoyCopyFlag = useFlags()?.yoyCopy;
  const ilosAvailable = useFlags()?.ilos;

  // get correct form
  const modalFormJsonMap: any = {
    MCPAR: yoyCopyFlag ? mcparFormJson : mcparFormJsonWithoutYoY,
    MLR: mlrFormJson,
  };
  const modalFormJson = modalFormJsonMap[reportType]!;
  const [form, setForm] = useState<FormJson>(modalFormJson);

  useEffect(() => {
    // make deep copy of baseline form for customization
    let customizedModalForm: FormJson = JSON.parse(
      JSON.stringify(modalFormJson)
    );
    // check if yoy copy field exists in form
    const yoyCopyFieldIndex = form.fields.findIndex(
      (field: FormField | FormLayoutElement) =>
        field.id === "copyFieldDataSourceId"
    );
    // if yoyCopyField is in form && (not creating new report || no reports eligible for copy)
    if (
      yoyCopyFieldIndex > -1 &&
      (selectedReport?.id || !copyEligibleReportsByState?.length)
    ) {
      customizedModalForm.fields[yoyCopyFieldIndex].props!.disabled = true;
    }
    // check if program is PCCM field exists in form
    const programIsPCCMFieldIndex = form.fields.findIndex(
      (field: FormField | FormLayoutElement) => field.id === "programIsPCCM"
    );
    // if programIsPCCMField is in form && not creating new report
    if (programIsPCCMFieldIndex > -1 && selectedReport?.id) {
      customizedModalForm.fields[programIsPCCMFieldIndex].props!.disabled =
        true;
    }
    setForm(customizedModalForm);
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
    const programIsPCCM = formData["programIsPCCM"];

    return {
      metadata: {
        programName,
        reportingPeriodStartDate,
        reportingPeriodEndDate,
        dueDate,
        combinedData,
        lastAlteredBy: full_name,
        copyFieldDataSourceId: copyFieldDataSourceId?.value,
        programIsPCCM,
        ilosAvailable,
        locked: false,
        submissionCount: 0,
        previousRevisions: [],
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
          submissionCount: 0,
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
        subheading: selectedReport?.id ? "" : form.heading?.subheading,
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
