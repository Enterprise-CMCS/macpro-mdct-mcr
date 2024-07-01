import { AnyObject } from "../types";

/* This function is pretty large, however it is temporary (until the release of this new MCPAR template in July 25th)  */
export const handleTemplateForJulyMcparRelease = (
  originalReportTemplate: any
) => {
  const reportTemplate = structuredClone(originalReportTemplate);
  for (let route of reportTemplate.routes) {
    // remove ILOS routes from template
    if (
      route.path === "/mcpar/program-information" ||
      route.path === "/mcpar/plan-level-indicators"
    ) {
      // These sections' last subsection is ILOS-specific; remove it.
      route.children = route.children?.slice(0, -1);
    }
    // remove Appeals and Grievances questions from template
    if (route.path === "/mcpar/plan-level-indicators") {
      const filteredAppealsAndGrievances =
        route.children[3].children[0].drawerForm.fields.filter(
          (field: AnyObject) => {
            return !field.id.startsWith("plan_appeals");
          }
        );
      route.children[3].children[0].drawerForm.fields =
        filteredAppealsAndGrievances;

      // replace Program Integrity questions in template
      const filteredProgramIntegrity =
        route.children[6].drawerForm.fields.filter((field: AnyObject) => {
          return !field.id.startsWith("plan_annualOverpaymentRecoveryReport");
        });
      route.children[6].drawerForm.fields = filteredProgramIntegrity;

      // remove new radio button option from question D1.X.6 in template
      route.children[6].drawerForm.fields[5].props.choices.splice(1, 1);

      // insert question D1.X.9 into template
      const questionD1X9 = {
        id: "plan_overpaymentRecoveryReportDescription",
        type: "textarea",
        validation: "text",
        props: {
          label: "D1.X.9 Plan overpayment reporting to the state",
          hint: "Describe the plan’s latest annual overpayment recovery report submitted to the state as required under 42 CFR 438.608(d)(3).</br>Include, at minimum, the following information:<ul><li>The date of the report (rating period or calendar year).</li><li>The dollar amount of overpayments recovered.</li><li>The ratio of the dollar amount of overpayments recovered as a percent of premium revenue as defined in MLR reporting under 42 CFR 438.8(f)(2).</li></ul>",
        },
      };
      route.children[6].drawerForm.fields.splice(7, 0, questionD1X9);
    }
  }

  return reportTemplate;
};
