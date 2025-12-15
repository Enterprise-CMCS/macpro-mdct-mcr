import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

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
