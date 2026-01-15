import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const mentalHealthAndSubstanceUseDisorderParityRoute: FormRoute = {
  name: "XII: Mental Health and Substance Use Disorder Parity",
  path: "/mcpar/program-level-indicators/mental-health-and-substance-use-disorder-parity",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section C: Program-Level Indicators",
      subsection: "Topic XII. Mental Health and Substance Use Disorder Parity",
      spreadsheet: "C1_Program_Set",
    },
  },
  form: {
    id: "cmhsudp",
    fields: [
      {
        id: "program_doesThisProgramIncludeMCOs",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "C1.XII.4 Does this program include MCOs?",
          hint: "If “Yes”, please complete the following questions.",
          choices: [
            {
              id: "WezgX4VYsCyGJ3w0ncCpsWkH",
              label: "No",
            },
            {
              id: "A4uFU0YyU9useo3DsWjnH264",
              label: "Yes",
              children: [
                {
                  id: "program_areServicesProvidedToMcEnrolleesByPihpPahpOrFfsDeliverySystem",
                  type: ReportFormFieldType.RADIO,
                  validation: {
                    type: ValidationType.RADIO,
                    nested: true,
                    parentFieldName: "program_doesThisProgramIncludeMCOs",
                    parentOptionId: "A4uFU0YyU9useo3DsWjnH264",
                  },
                  props: {
                    label:
                      "C1.XII.5 Are ANY services provided to MCO enrollees by a PIHP, PAHP, or FFS delivery system?",
                    hint: "(i.e. some services are delivered via fee for service (FFS), prepaid inpatient health plan (PIHP), or prepaid ambulatory health plan (PAHP) delivery system)",
                    choices: [
                      {
                        id: "FjCDK2ONpqtd0z2DTz8YaGjP",
                        label: "Yes",
                      },
                      {
                        id: "wI8TMrw0hoJzYUjjH2mO7Om4",
                        label: "No",
                      },
                    ],
                  },
                },
                {
                  id: "program_didStateOrMCOsCompleteAnalysis",
                  type: ReportFormFieldType.RADIO,
                  validation: {
                    type: ValidationType.RADIO,
                    nested: true,
                    parentFieldName: "program_doesThisProgramIncludeMCOs",
                    parentOptionId: "A4uFU0YyU9useo3DsWjnH264",
                  },
                  props: {
                    label:
                      "C1.XII.6 Did the State or MCOs complete the most recent parity analysis(es)?",
                    choices: [
                      {
                        id: "hzfe4WnueXTUDk0FoFcJcq1G",
                        label: "MCO",
                      },
                      {
                        id: "v6woH8xYbE59VMs82VxJlisF",
                        label: "State",
                      },
                      {
                        id: "vbuAOFC6DSx397ZoibATdonl",
                        label: "Other, specify",
                        children: [
                          {
                            id: "program_didStateOrMCOsCompleteAnalysis-otherText",
                            type: ReportFormFieldType.TEXTAREA,
                            validation: {
                              type: ReportFormFieldType.TEXT,
                              nested: true,
                              parentFieldName:
                                "program_didStateOrMCOsCompleteAnalysis",
                              parentOptionId: "vbuAOFC6DSx397ZoibATdonl",
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
                {
                  id: "program_triggeringEventsNecessitatingUpdatesToParityAnalysis",
                  type: ReportFormFieldType.RADIO,
                  validation: {
                    type: ValidationType.RADIO,
                    nested: true,
                    parentFieldName: "program_doesThisProgramIncludeMCOs",
                    parentOptionId: "A4uFU0YyU9useo3DsWjnH264",
                  },
                  props: {
                    label:
                      "C1.XII.7a Have there been any events in the reporting period that necessitated an update to the parity analysis(es)?",
                    hint: "(e.g. changes in benefits, quantitative treatment limits (QTLs), non-quantitative treatment limits (NQTLs), or financial requirements; the addition of a new managed care plan (MCP) providing services to MCO enrollees; and/or deficiencies corrected)",
                    choices: [
                      {
                        id: "q6F3AvbLimTiLUDN2xQvd2ip",
                        label: "Yes",
                        children: [
                          {
                            id: "descriptionOfEventsInReportingPeriodThatNecessitatedUpdateToParityAnalysis",
                            type: ReportFormFieldType.CHECKBOX,
                            validation: {
                              type: ReportFormFieldType.CHECKBOX,
                              nested: true,
                              parentFieldName:
                                "program_triggeringEventsNecessitatingUpdatesToParityAnalysis",
                              parentOptionId: "q6F3AvbLimTiLUDN2xQvd2ip",
                            },
                            props: {
                              label:
                                "C1.XII.7b Describe the event(s) that necessitated an update to the parity analysis(es).",
                              hint: "Select all that apply.",
                              choices: [
                                {
                                  id: "iLzELvKBsBoZxJ96fLU5wyDM",
                                  label: "Changes in benefits",
                                },
                                {
                                  id: "Yw9kYLAE5zz12meBm4g2lnfR",
                                  label:
                                    "Changes in financial requirements (e.g., copays, coinsurance, deductibles, out-of-pocket maximums)",
                                },
                                {
                                  id: "AQ0h7WeZm1nJ8Crr1BeOCCy0",
                                  label:
                                    "Changes in quantitative treatment limits (QTLs), (limits on the scope or duration of benefits that are represented numerically, such as day limits or visit limits)",
                                },
                                {
                                  id: "KDjEgzfwI8WRVvS6cAwa27mH",
                                  label:
                                    "Changes in non-quantitative treatment limits (NQTLs), (which otherwise limit the scope or duration of benefits, e.g., utilization management, network admission standards)",
                                },
                                {
                                  id: "3jrOpqW0YtFPDAgGcf7Ar9FS",
                                  label:
                                    "Addition of a new managed care plan (MCP) providing services to MCO enrollees",
                                },
                                {
                                  id: "tsdVnIPFc9RitXWFNHC5MTP0",
                                  label: "Deficiencies corrected",
                                },
                                {
                                  id: "SWvgQnZAENJ1sxe0Xf408AoE",
                                  label: "Other, specify",
                                  children: [
                                    {
                                      id: "descriptionOfEventsInReportingPeriodThatNecessitatedUpdateToParityAnalysis-otherText",
                                      type: ReportFormFieldType.TEXTAREA,
                                      validation: {
                                        type: ReportFormFieldType.TEXT,
                                        nested: true,
                                        parentFieldName:
                                          "descriptionOfEventsInReportingPeriodThatNecessitatedUpdateToParityAnalysis",
                                        parentOptionId:
                                          "SWvgQnZAENJ1sxe0Xf408AoE",
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                        ],
                      },
                      {
                        id: "avJf3iStX8t0lI6Ck8t51ZHy",
                        label: "No",
                      },
                    ],
                  },
                },
                {
                  id: "program_whenWasTheLastParityAnalysisCoveringThisProgramCompleted",
                  type: ReportFormFieldType.DATE,
                  validation: {
                    type: ValidationType.DATE,
                    nested: true,
                    parentFieldName: "program_doesThisProgramIncludeMCOs",
                    parentOptionId: "A4uFU0YyU9useo3DsWjnH264",
                  },
                  props: {
                    label:
                      "C1.XII.8 When was the last parity analysis(es) for this program completed?",
                    hint: "States with ANY services provided to MCO enrollees by an entity other than an MCO should report the date the state completed its most recent summary parity analysis report. States with NO services provided to MCO enrollees by an entity other than an MCO should report the most recent date any MCO sent the state its parity analysis (the state may have multiple reports, one for each MCO).",
                  },
                },
                {
                  id: "program_whenWasTheLastParityAnalysisForThisProgramSubmittedToCMS",
                  type: ReportFormFieldType.DATE,
                  validation: {
                    type: ValidationType.DATE,
                    nested: true,
                    parentFieldName: "program_doesThisProgramIncludeMCOs",
                    parentOptionId: "A4uFU0YyU9useo3DsWjnH264",
                  },
                  props: {
                    label:
                      "C1.XII.9 When was the last parity analysis(es) for this program submitted to CMS?",
                    hint: "States with ANY services provided to MCO enrollees by an entity other than an MCO should report the date the state’s most recent summary parity analysis report was submitted to CMS. States with NO services provided to MCO enrollees by an entity other than an MCO should report the most recent date the state submitted any MCO’s parity report to CMS (the state may have multiple parity reports, one for each MCO).",
                  },
                },
                {
                  id: "program_wereAnyDeficienciesIdentifiedDuringTheAnalysisConducted",
                  type: ReportFormFieldType.RADIO,
                  validation: {
                    type: ValidationType.RADIO,
                    nested: true,
                    parentFieldName: "program_doesThisProgramIncludeMCOs",
                    parentOptionId: "A4uFU0YyU9useo3DsWjnH264",
                  },
                  props: {
                    label:
                      "C1.XII.10a In the last analysis(es) conducted, were any deficiencies identified?",
                    choices: [
                      {
                        id: "z3iOa69iV6mQVBWTqIJBl5Ck",
                        label: "Yes",
                        children: [
                          {
                            id: "descriptionOfDeficienciesInLastAnalysisConducted",
                            type: ReportFormFieldType.TEXTAREA,
                            validation: {
                              type: ReportFormFieldType.TEXT,
                              nested: true,
                              parentFieldName:
                                "program_wereAnyDeficienciesIdentifiedDuringTheAnalysisConducted",
                              parentOptionId: "z3iOa69iV6mQVBWTqIJBl5Ck",
                            },
                            props: {
                              label:
                                "C1.XII.10b In the last analysis(es) conducted, describe all deficiencies identified.",
                            },
                          },
                          {
                            id: "program_haveTheseDeficienciesBeenResolvedForAllPlans",
                            type: ReportFormFieldType.RADIO,
                            validation: {
                              type: ReportFormFieldType.RADIO,
                              nested: true,
                              parentFieldName:
                                "program_doesThisProgramIncludeMCOs",
                              parentOptionId: "A4uFU0YyU9useo3DsWjnH264",
                            },
                            props: {
                              label:
                                "C1.XII.11a As of the end of this reporting period, have these deficiencies been resolved for all plans?",
                              choices: [
                                {
                                  id: "sLd8M1tgf9dpVIZWRYEXvdBe",
                                  label: "Yes",
                                },
                                {
                                  id: "DCDJH4S1JHF7G5bZUMxOVMTe",
                                  label: "No",
                                  children: [
                                    {
                                      id: "reasonsForNoDeficiencyResolutionsForAllPlans",
                                      type: ReportFormFieldType.CHECKBOX,
                                      validation: {
                                        type: ReportFormFieldType.CHECKBOX,
                                        nested: true,
                                        parentFieldName:
                                          "program_haveTheseDeficienciesBeenResolvedForAllPlans",
                                        parentOptionId:
                                          "DCDJH4S1JHF7G5bZUMxOVMTe",
                                      },
                                      props: {
                                        label:
                                          "C1.XII.11b If deficiencies have not been resolved, select all that apply.",
                                        choices: [
                                          {
                                            id: "bEJDkUR6l4zwIgj3aLDd7TZ9",
                                            label:
                                              "Noncompliant limits are still being applied in operations, affecting some providers and/or enrollees.",
                                          },
                                          {
                                            id: "E63ZYRXBmOocAEUS9JA1PkNB",
                                            label:
                                              "Non-compliance is related to updated parity documentation not yet submitted to CMS.",
                                          },
                                          {
                                            id: "NXbySoHbH3AvbOIvIUREAPsC",
                                            label: "Other, specify",
                                            children: [
                                              {
                                                id: "reasonsForNoDeficiencyResolutionsForAllPlans-otherText",
                                                type: ReportFormFieldType.TEXTAREA,
                                                validation: {
                                                  type: ReportFormFieldType.TEXT,
                                                  nested: true,
                                                  parentFieldName:
                                                    "reasonsForNoDeficiencyResolutionsForAllPlans",
                                                  parentOptionId:
                                                    "NXbySoHbH3AvbOIvIUREAPsC",
                                                },
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                                {
                                  id: "vWaoaAmH4YXjQStwgz5BcBGH",
                                  label: "No deficiencies identified",
                                },
                              ],
                            },
                          },
                        ],
                      },
                      {
                        id: "id5YVp8cXSTlUNX3dKXSqxqa",
                        label: "No",
                      },
                    ],
                  },
                },
                {
                  id: "program_hasStatePostedCurrentParityAnalysisCoveringThisProgram",
                  type: ReportFormFieldType.RADIO,
                  validation: {
                    type: ValidationType.RADIO,
                    nested: true,
                    parentFieldName: "program_doesThisProgramIncludeMCOs",
                    parentOptionId: "A4uFU0YyU9useo3DsWjnH264",
                  },
                  props: {
                    label:
                      "C1.XII.12a Has the state posted the current parity analysis(es) covering this program on its website?",
                    hint: [
                      {
                        type: "span",
                        content:
                          "The current parity analysis/analyses must be posted on the state Medicaid program website. States with ANY services provided to MCO enrollees by an entity other than MCO should have a single state summary parity analysis report.",
                        props: {
                          className: "fake-paragraph-break",
                        },
                      },
                      {
                        type: "span",
                        content:
                          "States with NO services provided to MCO enrollees by an entity other than the MCO may have multiple parity reports (by MCO), in which case all MCOs’ separate analyses must be posted. A “Yes” response means that the parity analysis for either the state or for ALL MCOs has been posted.",
                        props: {
                          className: "fake-paragraph-break",
                        },
                      },
                    ],
                    choices: [
                      {
                        id: "fncOB9LFBZd1nFJvLv9YM1Pb",
                        label: "Yes",
                        children: [
                          {
                            id: "websiteStatePostedCurrentParityAnalysisCoveringThisProgram",
                            type: ReportFormFieldType.TEXT,
                            validation: {
                              type: ValidationType.URL,
                              nested: true,
                              parentFieldName:
                                "program_hasStatePostedCurrentParityAnalysisCoveringThisProgram",
                              parentOptionId: "fncOB9LFBZd1nFJvLv9YM1Pb",
                            },
                            props: {
                              label: "C1.XII.12b Provide the URL link(s).",
                              hint: "Response must be a valid hyperlink/URL beginning with “http://” or “https://”. Separate links with commas.",
                            },
                          },
                        ],
                      },
                      {
                        id: "fmEETS25bqmm0GIwg0CGRIn6",
                        label: "No",
                        children: [
                          {
                            id: "dateStateWillRemediateThisAreaOfNoncompliance",
                            type: ReportFormFieldType.DATE,
                            validation: {
                              type: ReportFormFieldType.DATE,
                              nested: true,
                              parentFieldName:
                                "program_hasStatePostedCurrentParityAnalysisCoveringThisProgram",
                              parentOptionId: "fmEETS25bqmm0GIwg0CGRIn6",
                            },
                            props: {
                              label:
                                "C1.XII.12c When will the state post the current parity analysis(es) on its State Medicaid website in accordance with 42 CFR § 438.920(b)(1)?",
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
