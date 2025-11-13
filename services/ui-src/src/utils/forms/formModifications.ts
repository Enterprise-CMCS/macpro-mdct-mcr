// types
import {
  AnyObject,
  FormJson,
  ReportType,
  StandardReportPageShape,
} from "types";
// verbiage
import accordionVerbiage from "verbiage/pages/accordion";

export const addPlanChoices = (
  form: FormJson,
  plans: AnyObject[] = []
): FormJson => {
  const fieldsToEdit = ["plansExemptFromQualityMeasures"];
  const choices = plans.map((plan: AnyObject) => ({
    id: plan.id,
    label: plan.name,
  }));

  const fields = form.fields.map((field) => {
    if (fieldsToEdit.includes(field.id)) {
      return {
        ...field,
        props: {
          ...field.props,
          choices,
        },
      };
    }
    return field;
  });

  return {
    ...form,
    fields,
  };
};

export const formModifications = (
  reportType: string = "",
  route: StandardReportPageShape,
  fieldData: AnyObject = {}
) => {
  let accordion = route.verbiage.accordion;
  let formJson = route.form;

  if (
    reportType === ReportType.MCPAR &&
    route.path ===
      "/mcpar/plan-level-indicators/quality-measures/new-plan-exemption"
  ) {
    accordion = accordionVerbiage.MCPAR.formIntro;
    formJson = addPlanChoices(route.form, fieldData.plans);
  }

  return {
    accordion,
    formJson,
  };
};
