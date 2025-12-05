import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../utils/types";

export const grievancesOverviewRoute: DrawerFormRoute = {
  name: "Grievances Overview",
  path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances/grievances-overview",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.PLANS,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic IV. Appeals, State Fair Hearings & Grievances",
      spreadsheet: "D1_Plan_Set",
      info: [
        {
          type: "heading",
          as: "h4",
          content: "Grievances Overview",
        },
      ],
    },
    dashboardTitle: "Report on grievances for each plan",
    drawerTitle: "Report on grievances for {{name}}",
    missingEntityMessage: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/mcpar/program-information/add-plans",
            },
          },
        ],
      },
    ],
  },
  drawerForm: {
    id: "dgo",
    fields: [
      {
        id: "plan_resolvedGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.10 Grievances resolved",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of grievances resolved by the plan during the reporting year that were related to access to care.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "A grievance is “resolved” when it has reached completion and been closed by the plan.",
              props: {
                className: "fake-paragraph-break",
              },
            },
          ],
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_activeGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.11 Active grievances",
          hint: "Enter the total number of grievances still pending or in process (not yet resolved) as of the end of the reporting year.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_ltssUserFieldGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.12 Grievances filed on behalf of LTSS users",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of grievances filed during the reporting year by or on behalf of LTSS users.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "An LTSS user is an enrollee who received at least one LTSS service at any point during the reporting year (regardless of whether the enrollee was actively receiving LTSS at the time that the grievance was filed). If this does not apply, enter N/A.",
              props: {
                className: "fake-paragraph-break",
              },
            },
          ],
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledGrievance",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.13 Number of critical incidents filed during the reporting period by (or on behalf of) an LTSS user who previously filed a grievance",
          hint: [
            {
              type: "span",
              content:
                "For managed care plans that cover LTSS, enter the number of critical incidents filed within the reporting year by (or on behalf of) LTSS users who previously filed grievances in the reporting year. The grievance and critical incident do not have to have been “related” to the same issue - they only need to have been filed by (or on behalf of) the same enrollee. Neither the critical incident nor the grievance need to have been filed in relation to delivery of LTSS - they may have been filed for any reason, related to any service received (or desired) by an LTSS user.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "If the managed care plan does not cover LTSS, the state should enter “N/A” in this field. Additionally, if the state already submitted this data for the reporting year via the CMS readiness review appeal and grievance report (because the managed care program or plan were new or serving new populations during the reporting year), and the readiness review tool was submitted for at least 6 months of the reporting year, the state can enter “N/A” in this field.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "To calculate this number, states or managed care plans should first identify the LTSS users for whom critical incidents were filed during the reporting year, then determine whether those enrollees had filed a grievance during the reporting year, and whether the filing of the grievance preceded the filing of the critical incident.",
              props: {
                className: "fake-paragraph-break",
              },
            },
          ],
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_timyleResolvedGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.14 Number of grievances for which timely resolution was provided",
          hint: [
            {
              type: "span",
              content:
                "Enter the number of grievances for which timely resolution was provided by plan during the reporting year.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "See 42 CFR §438.408(b)(1) for requirements related to the timely resolution of grievances.",
              props: {
                className: "fake-paragraph-break",
              },
            },
          ],
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
    ],
  },
};
