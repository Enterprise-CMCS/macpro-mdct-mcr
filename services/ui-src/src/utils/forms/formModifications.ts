// types
import {
  AnyObject,
  FormJson,
  ReportType,
  StandardReportPageShape,
} from "types";
// utils
import { routeChecker } from "utils";
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
  let showError = false;

  if (
    reportType === ReportType.MCPAR &&
    routeChecker.isNewPlanExemptionPage(route)
  ) {
    accordion = accordionVerbiage.MCPAR.formIntro;
    formJson = addPlanChoices(route.form, fieldData.plans);
    showError = !fieldData.plans || fieldData.plans.length < 1;
  }

  return {
    accordion,
    formJson,
    showError,
  };
};
