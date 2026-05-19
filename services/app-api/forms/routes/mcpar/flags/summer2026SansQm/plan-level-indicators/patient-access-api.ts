import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../../utils/types";

export const patientAccessApiRoute: DrawerFormRoute = {
  name: "XIV: Patient Access API Usage",
  path: "/mcpar/plan-level-indicators/patient-access-api",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.PLANS,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic XIV. Patient Access API Usage",
      spreadsheet: "D1_Plan_Set",
    },
    dashboardTitle:
      "Report on Patient Access API (Application Programming Interface) Usage for each plan",
    drawerTitle:
      "Patient Access Application Programming Interface (API) Usage for {{name}}",
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
    id: "dpaa",
    fields: [
      {
        id: "plan_numberOfUniqueBeneficiariesWithAtLeastOneDataTransfer",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIV.1 Number of unique beneficiaries with at least one data transfer",
          hint: "For the previous calendar year, indicate the total number of unique beneficiaries covered by the plan in this program whose data were transferred via the Patient Access API to a health application designated by the beneficiary. Provide program-specific numbers.",
        },
      },
      {
        id: "plan_numberOfUniqueBeneficiariesWithMultipleDataTransfers",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIV.2 Number of unique beneficiaries with multiple data transfers",
          hint: "For the previous calendar year, indicate the total number of unique beneficiaries covered by the plan in this program whose data were transferred more than once via the Patient Access API to a health application designated by the beneficiary. Provide program specific numbers.",
        },
      },
      {
        id: "plan_urlForPatientAccessApi",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.URL,
        props: {
          label: "D1.XIV.3 URL for Patient Access API",
          hint: "Provide the URL where the plan posts Patient Access API.",
        },
      },
      {
        id: "plan_urlForPatientResourcesForPatientAccessApi",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.URL,
        props: {
          label:
            "D1.XIV.4 URL for patient educational resources for Patient Access API",
          hint: "Provide the URL where the plan posts patient educational resources for the Patient Access API.",
        },
      },
      {
        id: "plan_urlForPatientResourcesForProviderAccessAndPayerToPayerApi",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.URL,
        props: {
          label:
            "D1.XIV.5 Provider Access and Payer-to-Payer API patient educational resources URL",
          hint: "Provide the URL where the plan posts patient educational resources for the Provider Access and Payer-to-Payer API.",
        },
      },
    ],
  },
};
