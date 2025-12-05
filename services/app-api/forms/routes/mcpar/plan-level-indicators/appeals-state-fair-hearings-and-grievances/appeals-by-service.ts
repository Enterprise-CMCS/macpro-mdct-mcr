import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../utils/types";

export const appealsByServiceRoute: DrawerFormRoute = {
  name: "Appeals by Service",
  path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/appeals-by-service",
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
          content: "Appeals by Service",
        },
        {
          type: "p",
          content:
            "Number of appeals resolved during the reporting period related to various services. Note: A single appeal may be related to multiple service types and may therefore be counted in multiple categories.",
        },
      ],
    },
    dashboardTitle: "Report on appeals by service for each plan",
    drawerTitle: "Report appeals by service for {{name}}",
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
    id: "dabs",
    fields: [
      {
        id: "plan_resolvedGeneralInpatientServiceAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.7a Resolved appeals related to general inpatient services",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of appeals resolved by the plan during the reporting year that were related to general inpatient care, including diagnostic and laboratory services.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "Do not include appeals related to inpatient behavioral health services – those should be included in indicator D1.IV.7c. If the managed care plan does not cover general inpatient services, enter “N/A”.",
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
        id: "plan_resolvedGeneralOutpatientServiceAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.7b Resolved appeals related to general outpatient services",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to general outpatient care not specifically listed in this section (e.g., primary and preventive services, specialist care, diagnostic and lab testing). Please do not include appeals related to outpatient behavioral health services – those should be included in indicator D1.IV.7d. If the managed care plan does not cover general outpatient services, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedInpatientBehavioralHealthServiceAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.7c Resolved appeals related to inpatient behavioral health services",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to inpatient mental health and/or substance use services. If the managed care plan does not cover inpatient behavioral health services, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedOutpatientBehavioralHealthServiceAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.7d Resolved appeals related to outpatient behavioral health services",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to outpatient mental health and/or substance use services. If the managed care plan does not cover outpatient behavioral health services, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedCoveredOutpatientPrescriptionDrugAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.7e Resolved appeals related to covered outpatient prescription drugs",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to outpatient prescription drugs covered by the managed care plan. If the managed care plan does not cover outpatient prescription drugs, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedSnfServiceAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.7f Resolved appeals related to skilled nursing facility (SNF) services",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to SNF services. If the managed care plan does not cover skilled nursing services, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedLtssServiceAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.7g Resolved appeals related to long-term services and supports (LTSS)",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of appeals resolved by the plan during the reporting year that were related to institutional LTSS or LTSS provided through home and community-based (HCBS) services, including personal care and self-directed services. If the managed care plan does not cover LTSS services, enter “N/A”.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "(Appeals related to denial of payment for a service already rendered should be counted in indicator D1.IV.6c).",
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
        id: "plan_resolvedDentalServiceAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.7h Resolved appeals related to dental services",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to dental services. If the managed care plan does not cover dental services, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedNemtAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.7i Resolved appeals related to non-emergency medical transportation (NEMT)",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to NEMT. If the managed care plan does not cover NEMT, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedDmeAndSuppliesAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.7k: Resolved appeals related to durable medical equipment (DME) & supplies",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to DME and/or supplies. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedHomeHealthAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.7l: Resolved appeals related to home health / hospice",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to home health and/or hospice. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedEmergencyServicesAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.7m: Resolved appeals related to emergency services / emergency department",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to emergency services and/or provided in the emergency department. Do not include appeals related to emergency outpatient behavioral health – those should be included in indicator D1.IV.7d. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedTherapiesAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.7n: Resolved appeals related to therapies",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to speech language pathology services or occupational, physical, or respiratory therapy services. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedOtherServiceAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.7o Resolved appeals related to other service types",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to services that do not fit into one of the categories listed above. If the managed care plan does not cover services other than those in items D1.IV.7a-n paid primarily by Medicaid, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
    ],
  },
};
