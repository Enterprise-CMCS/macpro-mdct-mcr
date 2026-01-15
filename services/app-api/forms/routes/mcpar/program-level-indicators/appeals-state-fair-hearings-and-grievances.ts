import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const appealsStateFairHearingsAndGrievancesRoute: FormRoute = {
  name: "IV: Appeals, State Fair Hearings & Grievances",
  path: "/mcpar/program-level-indicators/appeals-state-fair-hearings-and-grievances",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section C: Program-Level Indicators",
      subsection: "Topic IV. Appeals, State Fair Hearings & Grievances",
      spreadsheet: "C1_Program_Set",
    },
  },
  form: {
    id: "casfhag",
    fields: [
      {
        id: "program_criticalIncidentDefinition",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label:
            "C1.IV.1 State’s definition of “critical incident”, as used for reporting purposes in its MLTSS program",
          hint: "If this report is being completed for a managed care program that covers LTSS, what is the definition that the state uses for “critical incidents” within the managed care program? Respond with “N/A” if the managed care program does not cover LTSS.",
        },
      },
      {
        id: "program_standardAppealTimelyResolutionDefinition",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label:
            "C1.IV.2 State definition of “timely” resolution for standard appeals",
          hint: "Provide the state’s definition of timely resolution for standard appeals in the managed care program.</br>Per 42 CFR §438.408(b)(2), states must establish a timeframe for timely resolution of standard appeals that is no longer than 30 calendar days from the day the MCO, PIHP or PAHP receives the appeal.",
        },
      },
      {
        id: "program_expeditedAppealTimelyResolutionDefinition",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label:
            "C1.IV.3 State definition of “timely” resolution for expedited appeals",
          hint: "Provide the state’s definition of timely resolution for expedited appeals in the managed care program.</br>Per 42 CFR §438.408(b)(3), states must establish a timeframe for timely resolution of expedited appeals that is no longer than 72 hours after the MCO, PIHP or PAHP receives the appeal.",
        },
      },
      {
        id: "program_grievanceTimelyResolutionDefinition",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label:
            "C1.IV.4 State definition of “timely” resolution for grievances",
          hint: "Provide the state’s definition of timely resolution for grievances in the managed care program.</br>Per 42 CFR §438.408(b)(1), states must establish a timeframe for timely resolution of grievances that is no longer than 90 calendar days from the day the MCO, PIHP or PAHP receives the grievance.",
        },
      },
    ],
  },
};
