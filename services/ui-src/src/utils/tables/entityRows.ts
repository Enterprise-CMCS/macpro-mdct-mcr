// constants
import { getDefaultAnalysisMethodIds } from "../../constants";
import {
  DrawerReportPageShape,
  EntityShape,
  FormField,
  FormJson,
  isFieldElement,
  ModalOverlayReportPageShape,
  ReportShape,
  ReportType,
} from "types";
// utils
import { getForm, isIlosCompleted, otherSpecify } from "utils";

export const buildDrawerReportPageEntityRows = ({
  entities,
  patientAccessDisabled,
  priorAuthDisabled,
  report,
  route,
  hasForm,
  userIsEndUser,
}: BuildDrawerReportPageEntityRowsProps) => {
  const ilos = report.fieldData?.ilos;
  const isAnalysisMethodsPage = route.path?.includes("analysis-methods");
  const reportingOnIlos = route.path === "/mcpar/plan-level-indicators/ilos";

  const formParams = {
    ilos,
    isAnalysisMethodsPage,
    report,
    reportingOnIlos,
    route,
  };
  const form = getForm(formParams);
  const addEntityForm = getForm({ ...formParams, isCustomEntityForm: true });

  // Should have a form, but it's missing
  if (!form.id && !addEntityForm.id && hasForm) return [];

  return entities.map((entity: EntityShape) => {
    const addEntityDrawerForm = route.addEntityDrawerForm || ({} as FormJson);
    const canAddEntities = !!addEntityDrawerForm.id;
    const entityName = entity.name ?? entity.custom_analysis_method_name;

    const isCustomEntity =
      canAddEntities && !getDefaultAnalysisMethodIds().includes(entity.id);

    const isEntityCompleted = calculateIsEntityCompleted({
      addEntityForm,
      entity,
      form,
      isCustomEntity,
      reportingOnIlos,
    });

    const enterButton = getButtonProps({
      entityName,
      isAnalysisMethodsPage,
      isEntityCompleted,
      patientAccessDisabled,
      priorAuthDisabled,
      report,
      route,
      userIsEndUser,
    });

    // If no custom_analysis_method_description, returns undefined
    const descriptionText = entity.custom_analysis_method_description;

    const completeText = getCompleteText({
      entity,
      isAnalysisMethodsPage,
      isCustomEntity,
    });
    const incompleteText = getIncompleteText(isEntityCompleted);

    const showIncompleteIcon = canAddEntities && !isEntityCompleted;
    const showCompletionIcon = isEntityCompleted || showIncompleteIcon;

    return {
      canAddEntities,
      completeText,
      descriptionText,
      entity,
      entityName,
      enterButton,
      hasEntityNameWithDescription: hasEntityNameWithDescription(
        report.reportType
      ),
      incompleteText,
      isEntityCompleted,
      showCompletionIcon,
    };
  });
};

export const calculateIsEntityCompleted = ({
  addEntityForm,
  entity,
  form,
  isCustomEntity,
  reportingOnIlos,
}: CalculateEntityCompletionProps) => {
  const calculateEntityCompletion = () => {
    let formFields = form.fields;
    if (isCustomEntity) {
      formFields = addEntityForm.fields;
    }
    return formFields
      ?.filter(isFieldElement)
      .every((field: FormField) => field.id in entity);
  };

  /*
   * If the entity has the same fields from drawerForm fields, it was completed
   * at somepoint.
   */
  const isEntityCompleted = reportingOnIlos
    ? calculateEntityCompletion() && isIlosCompleted(reportingOnIlos, entity)
    : calculateEntityCompletion();

  return isEntityCompleted || false;
};

export const getButtonProps = ({
  entityName,
  isAnalysisMethodsPage,
  isEntityCompleted,
  patientAccessDisabled,
  priorAuthDisabled,
  route,
  report,
  userIsEndUser,
}: ButtonProps) => {
  let buttonText = "View";
  let disabled = false;

  if (userIsEndUser) {
    buttonText = isEntityCompleted ? "Edit" : "Enter";
  }

  const ariaLabel = `${buttonText} ${entityName}`;

  const hasIlos = report.fieldData?.ilos
    ? report.fieldData.ilos.length > 0
    : false;
  const hasPlans = report.fieldData?.plans
    ? report.fieldData.plans.length > 0
    : false;

  if (
    (route.path === "/mcpar/plan-level-indicators/ilos" && !hasIlos) ||
    (route.path === "/mcpar/plan-level-indicators/prior-authorization" &&
      priorAuthDisabled) ||
    (route.path === "/mcpar/plan-level-indicators/patient-access-api" &&
      patientAccessDisabled) ||
    (isAnalysisMethodsPage && !hasPlans)
  ) {
    disabled = true;
  }

  return {
    ariaLabel,
    buttonText,
    disabled,
  };
};

export const getCompleteText = ({
  entity,
  isAnalysisMethodsPage,
  isCustomEntity,
}: GetCompleteTextProps) => {
  if (isAnalysisMethodsPage) {
    const isUtilized =
      entity.analysis_applicable?.[0]?.value === "Yes" || isCustomEntity;
    const plans = entity.analysis_method_applicable_plans;

    if (!isUtilized || !plans) {
      return "Not utilized";
    }

    const frequencyVal = entity.analysis_method_frequency[0].value;
    const frequency = otherSpecify(
      frequencyVal,
      entity["analysis_method_frequency-otherText"]
    );
    const utilizedPlans = plans
      .map((entity: EntityShape) => entity.value)
      .sort()
      .join(", ");

    return `${frequency}: ${utilizedPlans}`;
  }

  return "Status: Incomplete";
};

export const getIncompleteText = (isEntityCompleted: boolean) => {
  if (isEntityCompleted) return;

  return "Select “Enter” to complete response.";
};

export const getProgramInfo = (entity: EntityShape) => {
  const {
    report_eligibilityGroup: reportEligibilityGroup,
    "report_eligibilityGroup-otherText": reportOtherText,
    report_planName: reportPlanName,
    report_programName: reportProgramName,
    report_reportingPeriodEndDate: reportEndDate,
    report_reportingPeriodStartDate: reportStartDate,
  } = entity;

  const eligibilityGroup = `${
    reportOtherText || reportEligibilityGroup[0].value
  }`;

  const reportingPeriod = `${reportStartDate} to ${reportEndDate}`;

  return [reportPlanName, reportProgramName, eligibilityGroup, reportingPeriod];
};

export const hasEntityNameWithDescription = (reportType: string) => {
  if (reportType === ReportType.MCPAR) {
    return false;
  }

  return true;
};

interface BuildDrawerReportPageEntityRowsProps {
  entities: EntityShape[];
  patientAccessDisabled: boolean;
  priorAuthDisabled: boolean;
  report: ReportShape;
  route: DrawerReportPageShape | ModalOverlayReportPageShape;
  hasForm: boolean;
  userIsEndUser: boolean;
}

interface ButtonProps {
  entityName: string;
  isAnalysisMethodsPage: boolean;
  isEntityCompleted: boolean;
  patientAccessDisabled: boolean;
  priorAuthDisabled: boolean;
  report: EntityShape;
  route: DrawerReportPageShape | ModalOverlayReportPageShape;
  userIsEndUser: boolean;
}

interface CalculateEntityCompletionProps {
  addEntityForm: FormJson;
  entity: EntityShape;
  isCustomEntity: boolean;
  form: FormJson;
  reportingOnIlos: boolean;
}

interface GetCompleteTextProps {
  entity: EntityShape;
  isAnalysisMethodsPage: boolean;
  isCustomEntity: boolean;
}
