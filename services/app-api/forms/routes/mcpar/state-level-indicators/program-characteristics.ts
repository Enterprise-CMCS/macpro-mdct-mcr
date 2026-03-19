import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const programCharacteristicsRoute: FormRoute = {
  name: "I: Program Characteristics",
  path: "/mcpar/state-level-indicators/program-characteristics",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section B: State-Level Indicators",
      subsection: "Topic I. Program Characteristics and Enrollment",
      spreadsheet: "B_State",
    },
  },
  form: {
    id: "bpc",
    fields: [
      {
        id: "state_statewideMedicaidEnrollment",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "B.I.1 Statewide Medicaid enrollment",
          hint: "Enter the average number of individuals enrolled in Medicaid per month during the reporting year (i.e., average member months).</br>Include all FFS and managed care enrollees and count each person only once, regardless of the delivery system(s) in which they are enrolled.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "state_statewideMedicaidManagedCareEnrollment",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "B.I.2 Statewide Medicaid risk-based managed care enrollment",
          hint: "Enter the average number of individuals enrolled in risk-based Medicaid managed care per month during the reporting year (i.e., average member months).</br>Include all MCOs and at-risk PIHPs and PAHPs only, and count each person only once, even if they are enrolled in multiple managed care programs or plans.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
    ],
  },
};
