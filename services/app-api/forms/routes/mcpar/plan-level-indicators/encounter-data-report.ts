import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const encounterDataReportRoute: DrawerFormRoute = {
  name: "III: Encounter Data Report",
  path: "/mcpar/plan-level-indicators/encounter-data-report",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.PLANS,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic III. Encounter Data",
      spreadsheet: "D1_Plan_Set",
    },
    dashboardTitle: "Report on encounter data for each plan",
    drawerTitle: "Report encounter data for {{name}}",
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
    id: "dedr",
    fields: [
      {
        id: "program_encounterDataSubmissionTimelinessStandardDefinition",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "D1.III.1 Definition of timely encounter data submissions",
          hint: "Describe the state’s standard for timely encounter data submissions used in this program.</br>If reporting frequencies and standards differ by type of encounter within this program, please explain.",
        },
      },
      {
        id: "plan_encounterDataSubmissionTimelinessCompliancePercentage",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.III.2 Share of encounter data submissions that met state’s timely submission requirements",
          hint: "What percent of the plan’s encounter data file submissions (submitted during the reporting year) met state requirements for timely submission? If the state has not yet received any encounter data file submissions for the entire contract year when it submits this report, the state should enter here the percentage of encounter data submissions that were compliant out of the file submissions it has received from the managed care plan for the reporting year.",
          mask: "percentage",
        },
      },
      {
        id: "plan_encounterDataSubmissionHipaaCompliancePercentage",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.III.3 Share of encounter data submissions that were HIPAA compliant",
          hint: "What percent of the plan’s encounter data submissions (submitted during the reporting year) met state requirements for HIPAA compliance?</br>If the state has not yet received encounter data submissions for the entire contract period when it submits this report, enter here percentage of encounter data submissions that were compliant out of the proportion received from the managed care plan for the reporting year.",
          mask: "percentage",
        },
      },
    ],
  },
};
