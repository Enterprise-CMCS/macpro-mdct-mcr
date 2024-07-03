import { AnyObject } from "../types";

/*
 * NOTE: This function is quite large, but it is temporary
 * (until the release of this new MCPAR template in July 25th)
 */
export const handleTemplateForJulyMcparRelease = (
  originalReportTemplate: any
) => {
  const reportTemplate = structuredClone(originalReportTemplate);
  for (let route of reportTemplate.routes) {
    // remove ILOS and Parity routes from template
    if (
      route.path === "/mcpar/program-information" ||
      route.path === "/mcpar/plan-level-indicators" ||
      route.path === "/mcpar/program-level-indicators"
    ) {
      route.children = removeIlosAndParityRoutes(route.children);
    }
    // remove Appeals and Grievances questions from template
    if (route.path === "/mcpar/plan-level-indicators") {
      route.children[3].children[0].drawerForm.fields =
        removeAppealsAndGrievances(route.children);

      // remove new radio button option from question D3.VIII.2 in template
      let idx = route.children[5].modalForm.fields[1].props.choices.findIndex(
        (choice: AnyObject) => {
          return choice.id === "GuYmG53wQ2sWmGlVnBIxnIof";
        }
      );
      route.children[5].modalForm.fields[1].props.choices.splice(idx, 1);

      // replace Program Integrity questions in template
      route.children[6].drawerForm.fields = replaceProgramIntegrity(
        route.children[6].drawerForm.fields
      );

      // remove new radio button option from question D1.X.6 in template
      idx = route.children[6].drawerForm.fields[5].props.choices.findIndex(
        (choice: AnyObject) => {
          return choice.id === "xkYWhuCMfYlT9MOWSLWk5JZb";
        }
      );
      route.children[6].drawerForm.fields[5].props.choices.splice(idx, 1);

      // insert question D1.X.9 into template
      const questionD1X9 = {
        id: "plan_overpaymentRecoveryReportDescription",
        type: "textarea",
        validation: "text",
        props: {
          label: "D1.X.9 Plan overpayment reporting to the state",
          hint: "Describe the plan's latest annual overpayment recovery report submitted to the state as required under 42 CFR 438.608(d)(3).</br>Include, at minimum, the following information:<ul><li>The date of the report (rating period or calendar year).</li><li>The dollar amount of overpayments recovered.</li><li>The ratio of the dollar amount of overpayments recovered as a percent of premium revenue as defined in MLR reporting under 42 CFR 438.8(f)(2).</li></ul>",
        },
      };
      route.children[6].drawerForm.fields.splice(7, 0, questionD1X9);
    }
  }

  return reportTemplate;
};

const removeIlosAndParityRoutes = (routeChildren: AnyObject[]) => {
  return routeChildren.slice(0, -1);
};

const removeAppealsAndGrievances = (routeChildren: AnyObject[]) => {
  return routeChildren[3].children[0].drawerForm.fields.filter(
    (field: AnyObject) => {
      return !field.id.startsWith("plan_appeals");
    }
  );
};

const replaceProgramIntegrity = (formFields: AnyObject[]) => {
  return formFields.filter((field: AnyObject) => {
    return !field.id.startsWith("plan_annualOverpaymentRecoveryReport");
  });
};
