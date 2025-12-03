import {
  FormRoute,
  PageTypes,
  ParentRoute,
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
          label: "B.I.2 Statewide Medicaid managed care enrollment",
          hint: "Enter the average number of individuals enrolled in any type of Medicaid managed care per month during the reporting year (i.e., average member months).</br>Include all managed care programs and count each person only once, even if they are enrolled in multiple managed care programs or plans.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
    ],
  },
};

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
export const programIntegrityRoute: FormRoute = {
  name: "X: Program Integrity",
  path: "/mcpar/state-level-indicators/program-integrity",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section B: State-Level Indicators",
      subsection: "Topic X: Program Integrity",
      spreadsheet: "B_State",
    },
  },
  form: {
    id: "bpi",
    fields: [
      {
        id: "state_focusedProgramIntegrityActivitiesConducted",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "B.X.1 Payment risks between the state and plans",
          hint: "Describe service-specific or other focused PI activities that the state conducted during the past year in this managed care program.</br>Examples include analyses focused on use of long-term services and supports (LTSS) or prescription drugs or activities that focused on specific payment issues to identify, address, and prevent fraud, waste or abuse. Consider data analytics, reviews of under/overutilization, and other activities. If no PI activities were performed, enter “No PI activities were performed during the reporting period” as your response. “N/A” is not an acceptable response.",
        },
      },
      {
        id: "state_overpaymentStandard",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "B.X.2 Contract standard for overpayments",
          hint: "Does the state allow plans to retain overpayments, require the return of overpayments, or has established a hybrid system? Select one.",
          choices: [
            {
              id: "UG7uunqq5UCtUq1is3iyiw",
              label: "Allow plans to retain overpayments",
            },
            {
              id: "3DGAqqnOBE2kwKVFMxUt3A",
              label: "State requires the return of overpayments",
            },
            {
              id: "jlIZKSPaf0GSVGmJbRUBzg",
              label: "State has established a hybrid system",
            },
            {
              id: "rZMeuRrGMR5viQxX79ZKKE",
              label: "Other, specify",
              children: [
                {
                  id: "state_overpaymentStandard-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "state_overpaymentStandard",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "state_overpaymentStandardContractLanguageLocation",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label:
            "B.X.3 Location of contract provision stating overpayment standard",
          hint: "Describe where the overpayment standard in the previous indicator is located in plan contracts, as required by 42 CFR 438.608(d)(1)(i).",
        },
      },
      {
        id: "state_overpaymentStandardDescription",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "B.X.4 Description of overpayment contract standard",
          hint: "Briefly describe the overpayment standard selected in indicator B.X.2.",
        },
      },
      {
        id: "state_overpaymentReportingMonitoringEfforts",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "B.X.5 State overpayment reporting monitoring",
          hint: "Describe how the state monitors plan performance in reporting overpayments to the state, e.g. does the state track compliance with this requirement and/or timeliness of reporting?</br>The regulations at 438.604(a)(7), 608(a)(2) and 608(a)(3) require plan reporting to the state on various overpayment topics (whether annually or promptly). This indicator is asking the state how it monitors that reporting.",
        },
      },
      {
        id: "state_beneficiaryCircumstanceChangeReconciliationEfforts",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "B.X.6 Changes in beneficiary circumstances",
          hint: "Describe how the state ensures timely and accurate reconciliation of enrollment files between the state and plans to ensure appropriate payments for enrollees experiencing a change in status (e.g., incarcerated, deceased, switching plans).",
        },
      },
      {
        id: "state_providerTerminationReportingMonitoringEfforts",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "B.X.7a Changes in provider circumstances: Monitoring plans",
          hint: "Does the state monitor whether plans report provider “for cause” terminations in a timely manner under 42 CFR 438.608(a)(4)? Select one.",
          choices: [
            {
              id: "WFrdLUutmEujEZkS7rWVqQ",
              label: "Yes",
              children: [
                {
                  id: "state_providerTerminationReportingMonitoringMetrics",
                  type: ReportFormFieldType.RADIO,
                  validation: {
                    type: ValidationType.RADIO,
                    nested: true,
                    parentFieldName:
                      "state_providerTerminationReportingMonitoringEfforts",
                  },
                  props: {
                    label: "B.X.7b Changes in provider circumstances: Metrics",
                    hint: "Does the state use a metric or indicator to assess plan reporting performance? Select one.",
                    choices: [
                      {
                        id: "SPqyExyg8UioX6Od1IWvlg",
                        label: "Yes",
                        children: [
                          {
                            id: "state_providerTerminationReportingMonitoringMetricsDescription",
                            type: ReportFormFieldType.TEXTAREA,
                            validation: {
                              type: ValidationType.TEXT,
                              nested: true,
                              parentFieldName:
                                "state_providerTerminationReportingMonitoringMetrics",
                            },
                            props: {
                              label:
                                "B.X.7c Changes in provider circumstances: Describe metric",
                              hint: "Describe the metric or indicator that the state uses.",
                            },
                          },
                        ],
                      },
                      {
                        id: "XPflE27BV0G3RJFYxuw8QA",
                        label: "No",
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "3tIhiqQxhEiSIhM7UW1DKQ",
              label: "No",
            },
          ],
        },
      },
      {
        id: "state_excludedEntityIdentifiedInFederalDatabaseCheck",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "B.X.8a Federal database checks: Excluded person or entities",
          hint: "During the state’s federal database checks, did the state find any person or entity excluded? Select one.</br>Consistent with the requirements at 42 CFR 455.436 and 438.602, the State must confirm the identity and determine the exclusion status of the MCO, PIHP, PAHP, PCCM or PCCM entity, any subcontractor, as well as any person with an ownership or control interest, or who is an agent or managing employee of the MCO, PIHP, PAHP, PCCM or PCCM entity through routine checks of Federal databases.",
          choices: [
            {
              id: "zrrv4vmXRkGhSkaS2V2d3A",
              label: "Yes",
              children: [
                {
                  id: "state_excludedEntityIdentificationInstancesSummary",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName:
                      "state_excludedEntityIdentifiedInFederalDatabaseCheck",
                  },
                  props: {
                    label:
                      "B.X.8b Federal database checks: Summarize instances of exclusion",
                    hint: "Summarize the instances and whether the entity was notified as required in 438.602(d). Report actions taken, such as plan-level sanctions and corrective actions.",
                  },
                },
              ],
            },
            {
              id: "ed1vyv6qB0a4aDLSeHOGPQ",
              label: "No",
            },
          ],
        },
      },
      {
        id: "state_ownershipControlDisclosureWebsite",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "B.X.9a Website posting of 5 percent or more ownership control",
          hint: "Does the state post on its website the names of individuals and entities with 5% or more ownership or control interest in MCOs, PIHPs, PAHPs, PCCMs and PCCM entities and subcontractors? Refer to 42 CFR 438.602(g)(3) and 455.104.",
          choices: [
            {
              id: "fNiPtEub20Soo1W5FcdU3A",
              label: "Yes",
              children: [
                {
                  id: "state_ownershipControlDisclosureWebsiteLink",
                  type: ReportFormFieldType.TEXT,
                  validation: {
                    type: ValidationType.URL,
                    nested: true,
                    parentFieldName: "state_ownershipControlDisclosureWebsite",
                  },
                  props: {
                    label:
                      "B.X.9b Website posting of 5 percent or more ownership control: Link",
                    hint: "What is the link to the website? Refer to 42 CFR 602(g)(3).",
                  },
                },
              ],
            },
            {
              id: "qhyidi0w4UiiBvCsoTgFOg",
              label: "No",
            },
          ],
        },
      },
      {
        id: "state_submittedDataAuditResults",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "B.X.10 Periodic audits",
          hint: "If the state conducted any audits during the contract year to determine the accuracy, truthfulness, and completeness of the encounter and financial data submitted by the plans, provide the link(s) to the audit results. Refer to 42 CFR 438.602(e). If no audits were conducted, please enter “No such audits were conducted during the reporting year” as your response. “N/A” is not an acceptable response.",
        },
      },
    ],
  },
};
export const priorAuthorizationRoute: FormRoute = {
  name: "XIII: Prior Authorization",
  path: "/mcpar/state-level-indicators/prior-authorization",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section B: State-Level Indicators",
      subsection: "Topic XIII. Prior Authorization",
      spreadsheet: "B_State",
      alert:
        "<b>Beginning June 2026, Indicators B.XIII.1a-b–2a-b must be completed. Submission of this data before June 2026 is optional.</b>",
    },
  },
  form: {
    id: "bpi",
    fields: [
      {
        id: "state_priorAuthorizationReporting",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "Are you reporting data prior to June 2026?",
          choices: [
            {
              id: "2nAidHmpZ9aJQMy0Gk0Zmldri84",
              label: "Not reporting data",
            },
            {
              id: "2nAidDjXBvvkzLtaeYyE2RymW4G",
              label: "Yes",
              hint: "By selecting “Yes” you will see new questions around timeframes. If the state sets timeframes for plans to respond to Prior Authorization requests that are different than timeframes specified by Federal regulation at 42 CFR §438.210(d), please respond “Yes” to the following questions.",
              children: [
                {
                  id: "state_timeframesForStandardPriorAuthorizationDecisions",
                  type: ReportFormFieldType.RADIO,
                  validation: {
                    type: ValidationType.RADIO,
                    nested: true,
                    parentFieldName: "state_priorAuthorizationReporting",
                    parentOptionId: "2nAidDjXBvvkzLtaeYyE2RymW4G",
                  },
                  props: {
                    label:
                      "B.XIII.1a Timeframes for standard prior authorization decisions",
                    hint: "Plans must provide notice of their decisions on prior authorization requests as expeditiously as the enrollee’s condition requires and within state-established timeframes. For rating periods that start before January 1, 2026, a state’s time frame may not exceed 14 calendar days after receiving the request. For rating periods that start on or after January 1, 2026, a state’s time frame may not exceed 7 calendar days after receiving the request. Does the state set timeframes shorter than these maximum timeframes for standard prior authorization requests?",
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
                              type: ReportFormFieldType.NUMBER,
                              nested: true,
                              mask: "comma-separated",
                              decimalPlacesToRoundTo: 2,
                              parentFieldName:
                                "state_timeframesForStandardPriorAuthorizationDecisions",
                              parentOptionId: "2nAidFCWvENhYZvzLt3DxJWOqtx",
                            },
                            props: {
                              label:
                                "B.XIII.1b State’s timeframe for standard prior authorization decisions",
                              hint: "Indicate the state’s maximum timeframe, as number of days, for plans to provide notice of their decisions on standard prior authorization requests.",
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
                  validation: {
                    type: ValidationType.RADIO,
                    nested: true,
                    parentFieldName: "state_priorAuthorizationReporting",
                    parentOptionId: "2nAidDjXBvvkzLtaeYyE2RymW4G",
                  },
                  props: {
                    label:
                      "B.XIII.2a Timeframes for expedited prior authorization decisions",
                    hint: "Plans must provide notice of their decisions on prior authorization requests as expeditiously as the enrollee’s condition requires and no later than 72 hours after receipt of the request for service. Does the state set timeframes shorter than the maximum timeframe for expedited prior authorization requests?",
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
                              type: ReportFormFieldType.NUMBER,
                              nested: true,
                              mask: "comma-separated",
                              decimalPlacesToRoundTo: 2,
                              parentFieldName:
                                "state_timeframesForExpeditedPriorAuthorizationDecisions",
                              parentOptionId: "2nAidJFG47lnFfJsNJS2tU7d4pp",
                            },
                            props: {
                              label:
                                "B.XIII.2b State’s timeframe for expedited prior authorization decisions",
                              hint: "Indicate the state’s maximum timeframe, as number of hours, for plans to provide notice of their decisions on expedited prior authorization requests.",
                            },
                          },
                        ],
                      },
                    ],
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

export const stateLevelIndicatorsRoute: ParentRoute = {
  name: "B: State-Level Indicators",
  path: "/mcpar/state-level-indicators",
  children: [
    programCharacteristicsRoute,
    encounterDataReportRoute,
    programIntegrityRoute,
    priorAuthorizationRoute,
  ],
};
