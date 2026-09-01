import { EntityShape, ReportShape, ModalOverlayReportPageShape } from "types";
import { mapValidationTypesToSchema } from "utils/validation/validation";
import { object } from "yup";

export const getMlrEntityStatus = (
  entity: EntityShape,
  report: ReportShape
) => {
  const reportFormValidation = Object.fromEntries(
    Object.entries(report?.formTemplate.validationJson ?? {}).filter(
      ([key]) => {
        return key.includes("report_") || key.includes("state_");
      }
    )
  );

  /*
   * Split the formValidation into 2 groups. 1 for fields that rely on whether
   * they show or not from a parent choice, and another that aren't themselves a child
   */
  const parentFormElements = Object.fromEntries(
    Object.entries(reportFormValidation).filter(
      ([key]) => !reportFormValidation[key]?.parentFieldName
    )
  );

  const childFormElements = Object.fromEntries(
    Object.entries(reportFormValidation).filter(
      ([key]) => reportFormValidation[key]?.parentFieldName
    )
  );

  // Grab formTemplate from MLR and get the Overlay and Modal forms
  const reportRoute = report.formTemplate
    .routes[1] as unknown as ModalOverlayReportPageShape;
  const overlayForm = reportRoute?.overlayForm;
  const modalForm = reportRoute?.modalForm;

  /*
   * Filter the child fields so that only ones that the user has the ability to see
   * are up against validation. If the parent hasn't been checked, then we
   * don't want to validate its child fields because the user doesn't have
   * the ability to see them, and they aren't required for their original choice.
   */
  const filteredChildFormValidation = Object.fromEntries(
    Object.entries(childFormElements).filter(([key]) => {
      // Get the answer the user submitted for the parent choice
      const parentFieldName = reportFormValidation[key]?.parentFieldName;
      const parentAnswer = entity[parentFieldName]?.[0];

      // Find where the answer is in the formTemplate
      const fieldInReport =
        overlayForm?.fields.find((field) => field.id === parentFieldName) ||
        modalForm?.fields.find((field) => field.id === parentFieldName);
      // And if we couldn't find it, return validation as false
      if (!fieldInReport) return false;

      /*
       * Now check to see if the field in the formTemplate contains the child choice.
       * if it doesn't then we dont want to validate it
       */
      const fieldInReportsChoices = fieldInReport?.props?.choices;
      return fieldInReportsChoices?.find(
        (field: { label: any }) => field.label == parentAnswer?.value
      )?.children;
    })
  );

  const formFieldsToValidate = {
    ...parentFormElements,
    ...filteredChildFormValidation,
  };

  /*
   * Legacy support: earlier MLR reports captured the program name in the free-text
   * `report_programName` field, which was later replaced by the `report_programNameList`
   * checkbox and the `report_otherProgramName` dynamic field. Reports that provide the
   * program name through the legacy field (or only through the dynamic "other" field)
   * are still complete, so don't fail completion on the newer checkbox when a program
   * name has been provided through any of these fields. Mirrors getProgramInfo's display.
   */
  const hasProgramName =
    (Array.isArray(entity.report_programNameList) &&
      entity.report_programNameList.length > 0) ||
    (Array.isArray(entity.report_otherProgramName) &&
      entity.report_otherProgramName.length > 0) ||
    (typeof entity.report_programName === "string" &&
      entity.report_programName.trim().length > 0);

  if (hasProgramName) {
    delete formFieldsToValidate.report_programNameList;
  }

  const formValidationSchema = mapValidationTypesToSchema(formFieldsToValidate);

  const formResolverSchema = object(formValidationSchema || {});

  try {
    return formResolverSchema.validateSync(entity);
  } catch {
    return false;
  }
};
