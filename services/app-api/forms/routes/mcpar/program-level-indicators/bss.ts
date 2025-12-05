import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const bssRoute: FormRoute = {
  name: "IX: BSS",
  path: "/mcpar/program-level-indicators/bss",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section C: Program-Level Indicators",
      subsection: "Topic IX: Beneficiary Support System (BSS)",
      spreadsheet: "C1_Program_Set",
    },
  },
  form: {
    id: "cbss",
    fields: [
      {
        id: "state_bssWebsite",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "C1.IX.1 BSS website",
          hint: "List the website(s) and/or email address(es) that beneficiaries use to seek assistance from the BSS through electronic means. Separate entries with commas.",
        },
      },
      {
        id: "state_bssEntityServiceAccessibility",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "C1.IX.2 BSS auxiliary aids and services",
          hint: "How do BSS entities offer services in a manner that is accessible to all beneficiaries who need their services, including beneficiaries with disabilities, as required by 42 CFR 438.71(b)(2))?</br>CFR 438.71 requires that the beneficiary support system be accessible in multiple ways including phone, Internet, in-person, and via auxiliary aids and services when requested.",
        },
      },
      {
        id: "state_bssEntityLtssProgramDataIssueAssistance",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "C1.IX.3 BSS LTSS program data",
          hint: "How do BSS entities assist the state with identifying, remediating, and resolving systemic issues based on a review of LTSS program data such as grievances and appeals or critical incident data? Refer to 42 CFR 438.71(d)(4).",
        },
      },
      {
        id: "state_bssEntityPerformanceEvaluationMethods",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "C1.IX.4 State evaluation of BSS entity performance",
          hint: "What are steps taken by the state to evaluate the quality, effectiveness, and efficiency of the BSS entities’ performance?",
        },
      },
    ],
  },
};
