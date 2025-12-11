import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../utils/types";

export const grievancesByServiceRoute: DrawerFormRoute = {
  name: "Grievances by Service",
  path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/grievances-by-service",
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
          content: "Grievances by Service",
        },
        {
          type: "p",
          content:
            "Report the number of grievances resolved by plan during the reporting period by service.",
        },
      ],
    },
    dashboardTitle: "Report on grievances by service for each plan",
    drawerTitle: "Report on grievances by service for {{name}}",
    drawerInfo: [
      {
        type: "p",
        content:
          "A single grievance may be related to multiple service types and may therefore be counted in multiple categories.",
      },
    ],
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
    id: "dgbs",
    fields: [
      {
        id: "plan_resolvedGeneralInpatientServiceGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.15a Resolved grievances related to general inpatient services",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to general inpatient care, including diagnostic and laboratory services. Do not include grievances related to inpatient behavioral health services — those should be included in indicator D1.IV.15c. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedGeneralOutpatientServiceGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.15b Resolved grievances related to general outpatient services",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to general outpatient care not specifically listed in this section (e.g., primary and preventive services, specialist care, diagnostic and lab testing). Do not include grievances related to outpatient behavioral health services - those should be included in indicator D1.IV.15d. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedInpatientBehavioralHealthServiceGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.15c Resolved grievances related to inpatient behavioral health services",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to inpatient mental health and/or substance use services. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedOutpatientBehavioralHealthServiceGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.15d Resolved grievances related to outpatient behavioral health services",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to outpatient mental health and/or substance use services. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedCoveredOutpatientPrescriptionDrugGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.15e Resolved grievances related to coverage of outpatient prescription drugs",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to outpatient prescription drugs covered by the managed care plan. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedSnfServiceGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.15f Resolved grievances related to skilled nursing facility (SNF) services",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to SNF services. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedLtssServiceGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.15g Resolved grievances related to long-term services and supports (LTSS)",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to institutional LTSS or LTSS provided through home and community-based (HCBS) services, including personal care and self-directed services. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedDentalServiceGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.15h Resolved grievances related to dental services",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to dental services. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedNemtGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.15i Resolved grievances related to non-emergency medical transportation (NEMT)",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to NEMT. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedDmeGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.15k Resolved grievances related to durable medical equipment (DME) & supplies",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to DME and/or supplies. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedHomeHealthGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.15l Resolved grievances related to home health / hospice",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to home health and/or hospice. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedEmergencyServicesGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.15m Resolved grievances related to emergency services / emergency department",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to emergency services and/or provided in the emergency department. Do not include grievances related to emergency outpatient behavioral health - those should be included in indicator D1.IV.15d. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedTherapyGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.15n Resolved grievances related to therapies",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to speech language pathology services or occupational, physical, or respiratory therapy services. If the managed care plan does not cover this type of service, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedOtherServiceGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.15o Resolved grievances related to other service types",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to services that do not fit into one of the categories listed above. If the managed care plan does not cover services other than those in items D1.IV.15a-n paid primarily by Medicaid, enter “N/A”.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
    ],
  },
};
