import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../utils/types";

export const networkAdequacyRoute: FormRoute = {
  name: "Network Adequacy",
  path: "/mcpar/program-level-indicators/availability-and-accessibility/network-adequacy",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section C: Program-Level Indicators",
      subsection: "Topic V. Availability, Accessibility and Network Adequacy",
      spreadsheet: "C1_Program_Set",
      info: [
        {
          type: "heading",
          as: "h4",
          content: "Network Adequacy",
        },
      ],
    },
  },
  form: {
    id: "cna",
    fields: [
      {
        id: "program_networkAdequacyChallenges",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "C1.V.1 Gaps/challenges in network adequacy",
          hint: "What are the state’s biggest challenges? Describe any challenges MCPs have maintaining adequate networks and meeting access standards. If the state and MCPs did not encounter any challenges, please enter “No challenges were encountered” as your response. “N/A” is not an acceptable response.",
        },
      },
      {
        id: "program_networkAdequacyGapResponseEfforts",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "C1.V.2 State response to gaps in network adequacy",
          hint: "How does the state work with MCPs to address gaps in network adequacy?",
        },
      },
    ],
  },
};
