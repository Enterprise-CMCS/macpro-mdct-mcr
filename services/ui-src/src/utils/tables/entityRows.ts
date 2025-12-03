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
import { getForm, isIlosCompleted, otherSpecify, routeChecker } from "utils";

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
  const isAnalysisMethodsPage = routeChecker.isAnalysisMethodsPage(route);
  const reportingOnIlos = routeChecker.isIlosPage(route);
  const isMeasuresAndResultsPage = routeChecker.isMeasuresAndResultsPage(route);

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
      isMeasuresAndResultsPage,
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
      isEntityCompleted,
    });
    const incompleteText = getIncompleteText({ isEntityCompleted });

    const showIncompleteIcon =
      (canAddEntities && !isEntityCompleted) || isMeasuresAndResultsPage;
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
  isMeasuresAndResultsPage,
}: CalculateEntityCompletionProps) => {
  const calculateMeasureCompletion = () => {
    if (
      entity?.measure_isReporting?.length > 0 &&
      entity?.measure_isNotReportingReason?.length > 0
    ) {
      return true;
    } else {
      const requiredFields = form.fields
        ?.filter(isFieldElement)
        .filter((field) => field.id !== "measure_isReporting");
      return calculateEntityCompletion(requiredFields);
    }
  };

  const calculateEntityCompletion = (fields?: FormField[]) => {
    let formFields = fields || form.fields;
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
    : isMeasuresAndResultsPage
    ? calculateMeasureCompletion()
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
    (routeChecker.isIlosPage(route) && !hasIlos) ||
    (routeChecker.isPriorAuthorizationPage(route) && priorAuthDisabled) ||
    (routeChecker.isPatientAccessApiPage(route) && patientAccessDisabled) ||
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
  isEntityCompleted,
  isCustomEntity,
}: GetCompleteTextProps) => {
  if (isAnalysisMethodsPage) {
    const {
      analysis_applicable: applicable,
      analysis_method_applicable_plans: plans,
      analysis_method_frequency: frequency,
      "analysis_method_frequency-otherText": frequencyOtherText,
    } = entity;

    if (!isCustomEntity && !applicable) return "Not started";
    if (applicable?.[0].value === "No" || !plans) return "Not utilized";

    const frequencyText = otherSpecify(frequency[0].value, frequencyOtherText);
    const utilizedPlans = plans
      .map((plan: EntityShape) => plan.value)
      .sort()
      .join(", ");

    return `${frequencyText}: ${utilizedPlans}`;
  }

  if (isEntityCompleted) return;

  return "Status: Incomplete";
};

export const getIncompleteText = ({
  isEntityCompleted,
}: GetInCompleteTextProps) => {
  if (isEntityCompleted) return;

  return "Select “Enter” to complete response.";
};

export const getEligibilityGroup = (entity: EntityShape) => {
  const {
    report_eligibilityGroup: reportEligibilityGroup,
    "report_eligibilityGroup-otherText": reportOtherText,
  } = entity;

  return reportOtherText || reportEligibilityGroup?.[0].value;
};

export const getReportingPeriodText = (entity: EntityShape) => {
  const {
    report_reportingPeriodEndDate: reportEndDate,
    report_reportingPeriodStartDate: reportStartDate,
  } = entity;

  return `${reportStartDate} to ${reportEndDate}`;
};

export const getProgramInfo = (entity: EntityShape) => {
  const {
    report_planName: reportPlanName,
    report_programName: reportProgramName,
  } = entity;

  const eligibilityGroup = getEligibilityGroup(entity);
  const reportingPeriod = getReportingPeriodText(entity);

  return [reportPlanName, reportProgramName, eligibilityGroup, reportingPeriod];
};

export const getMeasureIdentifier = (entity: EntityShape) => {
  const { measure_identifierCbe: cbe, measure_identifierCmit: cmit } = entity;

  if (cmit) return `CMIT: ${cmit}`;
  if (cbe) return `CBE: ${cbe}`;
  return;
};

export const getMeasureIdDisplayText = (entity: EntityShape) => {
  const identifier = getMeasureIdentifier(entity);
  return `Measure ID: ${identifier || "N/A"}`;
};

export const getMeasureValues = (entity: EntityShape, key: string) => {
  if (key !== "measure_identifier") {
    const value = entity[key];

    const formattedValue = Array.isArray(value)
      ? value.map((obj: EntityShape) => obj.value).join("; ")
      : value;

    return [formattedValue];
  }

  const {
    measure_identifierDefinition: identifierDefinition,
    measure_identifierDomain: identifierDomain,
    measure_identifierUrl: identifierUrl,
  } = entity;

  const identifier = getMeasureIdentifier(entity);
  if (identifier) return [identifier];

  const values: string[] = [`Other definition: ${identifierDefinition}`];

  if (identifierUrl) {
    values.push(`Link: ${identifierUrl}`);
  }

  if (identifierDomain) {
    const domains = identifierDomain
      .map((domain: EntityShape) => domain.value)
      .join(", ");
    values.push(`Measure domain(s): ${domains}`);
  }

  return values;
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
  isMeasuresAndResultsPage?: boolean;
}

interface GetCompleteTextProps {
  entity: EntityShape;
  isAnalysisMethodsPage: boolean;
  isEntityCompleted: boolean;
  isCustomEntity: boolean;
}

interface GetInCompleteTextProps {
  isEntityCompleted: boolean;
}
