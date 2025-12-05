import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const encounterDataReportRoute: FormRoute = {
  name: "III: Encounter Data Report",
  path: "/mcpar/state-level-indicators/encounter-data-report",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section B: State-Level Indicators",
      subsection: "Topic III. Encounter Data Report",
      spreadsheet: "B_State",
    },
  },
  form: {
    id: "bedr",
    fields: [
      {
        id: "state_encounterDataValidationEntity",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "B.III.1 Data validation entity",
          hint: "Select the state agency/division or contractor tasked with evaluating the validity of encounter data submitted by MCPs.</br>Encounter data validation includes verifying the accuracy, completeness, timeliness, and/or consistency of encounter data records submitted to the state by Medicaid managed care plans. Validation steps may include pre-acceptance edits and post-acceptance analyses. See Glossary in Excel Workbook for more information.",
          choices: [
            {
              id: "2iuXO7C6nk6cuP9JXbdd2w",
              label: "State Medicaid agency staff",
            },
            {
              id: "vmlIjQAe9kyz4FbtxBZINA",
              label: "Other state agency staff",
            },
            {
              id: "Vg8erh64Tk2nKd5olVwM9w",
              label: "State actuaries",
            },
            {
              id: "azz5rhd8V0GK27fIXaYSmw",
              label: "EQRO",
            },
            {
              id: "OLmKdPAEI0WnbSV1sVccVw",
              label: "Other third-party vendor",
            },
            {
              id: "SyQu5rtdV06hEaUBCLZsYw",
              label: "Proprietary system(s)",
              children: [
                {
                  id: "state_encounterDataValidationSystemHipaaCompliance",
                  type: ReportFormFieldType.RADIO,
                  validation: {
                    type: ValidationType.RADIO,
                    nested: true,
                    parentFieldName: "state_encounterDataValidationEntity",
                  },
                  props: {
                    label:
                      "B.III.2 HIPAA compliance of proprietary system(s) for encounter data validation",
                    hint: "Were the system(s) utilized fully HIPAA compliant? Select one.",
                    choices: [
                      {
                        id: "DeRYxSPAg0aZpPgqHfUcGA",
                        label: "Yes",
                      },
                      {
                        id: "CJVUudlBrEGWZAv7CVqKrQ",
                        label: "No",
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "Gxk89QOgQkmMTaNHH9WznQ",
              label: "Other, specify",
              children: [
                {
                  id: "state_encounterDataValidationEntity-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "state_encounterDataValidationEntity",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
};
