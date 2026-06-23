import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const priorAuthorizationRoute: FormRoute = {
  name: "XIII: Prior Authorization",
  path: "/mcpar/state-level-indicators/prior-authorization",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section B: State-Level Indicators",
      subsection: "Topic XIII. Prior Authorization",
      spreadsheet: "B_State",
    },
  },
  form: {
    id: "bpi",
    fields: [
      {
        id: "B.XIII_instructions",
        type: ReportFormFieldType.SECTION_CONTENT,
        props: {
          content:
            "If the state sets timeframes for plans to respond to Prior Authorization requests that are different than timeframes specified by Federal regulation at 42 CFR §438.210(d), please respond “Yes” to the following questions.",
        },
      },
      {
        id: "state_timeframesForStandardPriorAuthorizationDecisions",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "B.XIII.1a Timeframes for standard prior authorization decisions",
          hint: "Plans must provide notice of their decisions on prior authorization requests as expeditiously as the enrollee's condition requires and within state-established timeframes. For rating periods that start before January 1, 2026, a state's time frame may not exceed 14 calendar days after receiving the request. For rating periods that start on or after January 1, 2026, a state's time frame may not exceed 7 calendar days after receiving the request. Does the state set timeframes shorter than these maximum timeframes for standard prior authorization requests?",
          choices: [
            {
              id: "2mwADFxQVwjgYKMq5rEMPF8nryi",
              label: "No",
            },
            {
              id: "2nAidFCWvENhYZvzLt3DxJWOqtx",
              label: "Yes",
              children: [
                {
                  id: "state_stateTimeframeForStandardPriorAuthorizationDecisions",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.NUMBER,
                    nested: true,
                    parentFieldName:
                      "state_timeframesForStandardPriorAuthorizationDecisions",
                    parentOptionId: "2nAidFCWvENhYZvzLt3DxJWOqtx",
                  },
                  props: {
                    label:
                      "B.XIII.1b State's timeframe for standard prior authorization decisions",
                    hint: "Indicate the state's maximum timeframe, as number of days, for plans to provide notice of their decisions on standard prior authorization requests.",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "state_timeframesForExpeditedPriorAuthorizationDecisions",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "B.XIII.2a Timeframes for expedited prior authorization decisions",
          hint: "Plans must provide notice of their decisions on prior authorization requests as expeditiously as the enrollee's condition requires and no later than 72 hours after receipt of the request for service. Does the state set timeframes shorter than the maximum timeframe for expedited prior authorization requests?",
          choices: [
            {
              id: "2nAidGQyKBhG1gxK1SuXbBjJh0V",
              label: "No",
            },
            {
              id: "2nAidJFG47lnFfJsNJS2tU7d4pp",
              label: "Yes",
              children: [
                {
                  id: "state_stateTimeframeForExpeditedPriorAuthorizationDecisions",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.NUMBER,
                    nested: true,
                    parentFieldName:
                      "state_timeframesForExpeditedPriorAuthorizationDecisions",
                    parentOptionId: "2nAidJFG47lnFfJsNJS2tU7d4pp",
                  },
                  props: {
                    label:
                      "B.XIII.2b State's timeframe for expedited prior authorization decisions",
                    hint: "Indicate the state's maximum timeframe, as number of hours, for plans to provide notice of their decisions on expedited prior authorization requests.",
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
