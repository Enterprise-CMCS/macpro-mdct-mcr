import { EntityShape, ReportShape } from "types";
import { mapValidationTypesToSchema } from "utils/validation/validation";
import { object } from "yup";

export const getMlrEntityStatus = (
  report: ReportShape,
  entity: EntityShape
) => {
  const reportFormValidation = Object.fromEntries(
    Object.entries(report?.formTemplate.validationJson ?? {}).filter(
      ([key]) => key.includes("report_") || key.includes("state_")
    )
  );

  const formValidationSchema = mapValidationTypesToSchema(reportFormValidation);
  const formResolverSchema = object(formValidationSchema || {});

  try {
    return formResolverSchema.validateSync(entity);
  } catch (err) {
    return false;
  }
};
