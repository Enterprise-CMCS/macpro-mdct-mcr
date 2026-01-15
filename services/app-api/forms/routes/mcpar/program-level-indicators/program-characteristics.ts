import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const programCharacteristicsRoute: FormRoute = {
  name: "I: Program Characteristics",
  path: "/mcpar/program-level-indicators/program-characteristics",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section C: Program-Level Indicators",
      subsection: "Topic I: Program Characteristics",
      spreadsheet: "C1_Program_Set",
    },
  },
  form: {
    id: "cpc",
    fields: [
      {
        id: "program_contractTitle",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "C1.I.1 Program contract",
          hint: "Enter the title of the contract between the state and plans participating in the managed care program.",
        },
      },
      {
        id: "program_contractDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.DATE,
        props: {
          hint: "Enter the date of the contract between the state and plans participating in the managed care program.",
        },
      },
      {
        id: "program_contractUrl",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.URL,
        props: {
          label: "C1.I.2 Contract URL",
          hint: "Provide the hyperlink to the model contract or landing page for executed contracts for the program reported in this program.",
        },
      },
      {
        id: "program_type",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "C1.I.3 Program type",
          hint: "What is the type of MCPs that contract with the state to provide the services covered under the program? Select one.",
          choices: [
            {
              id: "rP1NWfC2jEGDwLSnSZVWDg",
              label: "Managed Care Organization (MCO)",
            },
            {
              id: "rJHLjCGMa0CW2YIX0HOC6w",
              label: "Prepaid Inpatient Health Plan (PIHP)",
            },
            {
              id: "MaaUjgQ8sk6egWLalC6h7w",
              label: "Prepaid Ambulatory Health Plan (PAHP)",
            },
            {
              id: "atiwcA9QUE2eoTchV2ZLtw",
              label: "Primary Care Case Management (PCCM) Entity",
            },
            {
              id: "oaiOvxrN6EqfTqV1lAc9kQ",
              label: "Other, specify",
              children: [
                {
                  id: "program_type-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "program_type",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "program_coveredSpecialBenefits",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "C1.I.4a Special program benefits",
          hint: "Are any of the four special benefit types covered by the managed care program: (1) behavioral health, (2) long-term services and supports, (3) dental, and (4) transportation, or (5) none of the above? Select one or more.</br>Only list the benefit type if it is a covered service as specified in a contract between the state and managed care plans participating in the program. Benefits available to eligible program enrollees via fee-for-service should not be listed here.",
          choices: [
            {
              id: "TXvFpzmNqkCgpLcDckL5QQ",
              label: "Behavioral health",
            },
            {
              id: "87et9SaCr0uSt4vqFercBw",
              label: "Long-term services and supports (LTSS)",
            },
            {
              id: "I1FxuAG3U0WbV5KSNGXXug",
              label: "Dental",
            },
            {
              id: "4hRianKm4Ui74nk0WqTA0A",
              label: "Transportation",
            },
            {
              id: "WDiUOKx9LUSmspPjMMZ1Qg",
              label: "None of the above",
              children: [
                {
                  id: "program_coveredSpecialBenefits-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "program_coveredSpecialBenefits",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "program_specialBenefitsAvailabilityVariation",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "C1.I.4b Variation in special benefits",
          hint: "What are any variations in the availability of special benefits within the program (e.g. by service area or population)? Enter “N/A” if not applicable.",
        },
      },
      {
        id: "program_enrollment",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "C1.I.5 Program enrollment",
          hint: "Enter the average number of individuals enrolled in this managed care program per month during the reporting year (i.e., average member months).",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "program_enrollmentBenefitChanges",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "C1.I.6 Changes to enrollment or benefits",
          hint: "Briefly explain any major changes to the population enrolled in or benefits provided by the managed care program during the reporting year. If there were no major changes, please enter “There were no major changes to the population or benefits during the reporting year” as your response. “N/A” is not an acceptable response.",
        },
      },
    ],
  },
};
