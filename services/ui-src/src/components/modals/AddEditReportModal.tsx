import { useContext, useState, useEffect } from "react";
// components
import { Form, Modal, ReportContext } from "components";
import { Spinner } from "@chakra-ui/react";
// constants
import {
  DEFAULT_ANALYSIS_METHODS,
  dropdownDefaultOptionText,
  States,
} from "../../constants";
// form
import mcparFormJson from "forms/addEditMcparReport/addEditMcparReport.json";
import mlrFormJson from "forms/addEditMlrReport/addEditMlrReport.json";
import naaarFormJson from "forms/addEditNaaarReport/addEditNaaarReport.json";
import naaarFormJsonWithProgramList from "forms/addEditNaaarReport/addEditNaaarReportWithProgramList.json";
// types
import {
  AnyObject,
  FieldChoice,
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
  defineProgramName,
  otherSpecify,
  useStore,
} from "utils";
import { useFlags } from "launchdarkly-react-client-sdk";

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
  const naaarProgramList = useFlags()?.naaarProgramList;
  const qualityMeasuresEnabled = useFlags()?.qualityMeasuresEnabled;

  // get correct form
  const modalFormJsonMap: any = {
    MCPAR: mcparFormJson,
    MLR: mlrFormJson,
    NAAAR: naaarProgramList ? naaarFormJsonWithProgramList : naaarFormJson,
  };

  const modalFormJson = modalFormJsonMap[reportType]!;
  const [form, setForm] = useState<FormJson>(modalFormJson);

  useEffect(() => {
    // make deep copy of baseline form for customization
    const customizedModalForm: FormJson = JSON.parse(
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

    const fieldsToDisableForEdit = [
      "programIsPCCM",
      "naaarExpectedSubmissionDateForThisProgram",
      "naaarSubmissionDateForThisProgram",
      "naaarSubmissionForThisProgram",
    ];

    // Not a new report
    if (selectedReport?.id) {
      fieldsToDisableForEdit.forEach((fieldId) => {
        const fieldIndex = form.fields.findIndex(
          (field) => field.id === fieldId
        );
        if (fieldIndex === -1) return;

        const fieldToDisable = customizedModalForm.fields[fieldIndex];
        if (fieldToDisable.props) {
          // Disable parent field
          fieldToDisable.props.disabled = true;

          const choices = fieldToDisable.props.choices;
          // Disable child fields
          choices?.forEach((choice: FieldChoice) => {
            choice.children?.forEach((child) => {
              if (child.props) child.props.disabled = true;
            });
          });
        }
      });
    }

    setForm(customizedModalForm);
  }, [selectedReport, copyEligibleReportsByState]);

  // MCPAR report payload
  const prepareMcparPayload = (formData: any) => {
    const newOrExistingProgram = formData["newOrExistingProgram"];
    const existingProgramNameSelection = formData[
      "existingProgramNameSelection"
    ] || {
      label: dropdownDefaultOptionText,
      value: "",
    };
    const existingProgramNameSuggestion =
      formData["existingProgramNameSuggestion"] || "";
    const newProgramName = formData["newProgramName"] || "";

    const programName = defineProgramName(
      newOrExistingProgram,
      existingProgramNameSelection,
      newProgramName
    );
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
    const naaarSubmissionForThisProgram =
      formData["naaarSubmissionForThisProgram"];
    const naaarSubmissionDateForThisProgram =
      formData["naaarSubmissionDateForThisProgram"] || undefined;
    const naaarExpectedSubmissionDateForThisProgram =
      formData["naaarExpectedSubmissionDateForThisProgram"] || undefined;

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
        locked: false,
        submissionCount: 0,
        previousRevisions: [],
        newOrExistingProgram,
        existingProgramNameSelection,
        existingProgramNameSuggestion,
        newProgramName,
        naaarSubmissionForThisProgram,
        naaarSubmissionDateForThisProgram,
        naaarExpectedSubmissionDateForThisProgram,
        qualityMeasuresEnabled,
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
        // All new MLR reports are NOT resubmissions by definition.
        versionControl: [
          {
            // pragma: allowlist nextline secret
            key: "versionControl-KFCd3rfEu3eT4UFskUhDtx",
            value: "No, this is an initial submission",
          },
        ],
      },
    };
  };

  // NAAAR report payload
  const prepareNaaarPayload = (formData: any, isNewReport: boolean) => {
    const newOrExistingProgram = formData["newOrExistingProgram"];
    const existingProgramNameSelection = formData[
      "existingProgramNameSelection"
    ] || {
      label: dropdownDefaultOptionText,
      value: "",
    };
    const existingProgramNameSuggestion =
      formData["existingProgramNameSuggestion"] || "";
    const newProgramName = formData["newProgramName"] || "";

    const programName = naaarProgramList
      ? defineProgramName(
          newOrExistingProgram,
          existingProgramNameSelection,
          newProgramName
        )
      : formData["programName"];
    const copyFieldDataSourceId = formData["copyFieldDataSourceId"];
    const dueDate = calculateDueDate(formData["reportingPeriodEndDate"]);
    const reportingPeriodStartDate = convertDateEtToUtc(
      formData["reportingPeriodStartDate"]
    );
    const reportingPeriodEndDate = convertDateEtToUtc(
      formData["reportingPeriodEndDate"]
    );
    const planTypeIncludedInProgram = formData["planTypeIncludedInProgram"];
    const planTypeOtherText = otherSpecify(
      planTypeIncludedInProgram[0].value,
      formData["planTypeIncludedInProgram-otherText"],
      null
    );

    return {
      metadata: {
        programName,
        reportingPeriodStartDate,
        reportingPeriodEndDate,
        dueDate,
        lastAlteredBy: full_name,
        copyFieldDataSourceId: copyFieldDataSourceId?.value,
        planTypeIncludedInProgram,
        "planTypeIncludedInProgram-otherText": planTypeOtherText,
        locked: false,
        submissionCount: 0,
        previousRevisions: [],
        newOrExistingProgram,
        existingProgramNameSelection,
        existingProgramNameSuggestion,
        newProgramName,
      },
      fieldData: isNewReport
        ? {
            analysisMethods: DEFAULT_ANALYSIS_METHODS,
          }
        : {},
    };
  };

  const writeReport = async (formData: any) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");

    let dataToWrite;
    if (reportType === "MCPAR") {
      dataToWrite = prepareMcparPayload(formData);
    } else if (reportType === "NAAAR") {
      dataToWrite = prepareNaaarPayload(formData, !selectedReport?.id);
    } else {
      dataToWrite = prepareMlrPayload(formData);
    }

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
        intro: selectedReport?.id ? "" : form.heading?.intro,
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
