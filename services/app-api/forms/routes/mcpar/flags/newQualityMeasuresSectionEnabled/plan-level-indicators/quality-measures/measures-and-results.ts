import {
  EntityType,
  ModalDrawerRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../../../utils/types";

export const measuresAndResultsRoute: ModalDrawerRoute = {
  name: "Measures and results",
  path: "/mcpar/plan-level-indicators/quality-measures/measures-and-results",
  pageType: PageTypes.MODAL_OVERLAY,
  entityType: EntityType.QUALITY_MEASURES,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic VII: Quality & Performance Measures",
      spreadsheet: "D2_Program_QualityMeasures",
      info: [
        {
          type: "heading",
          as: "h4",
          content: "Measures and results",
        },
      ],
    },
    dashboardTitle: "Quality & performance measure total count:",
    countEntitiesInTitle: true,
    tableHeader: "Measure name <br/> Measure ID / definition",
    addEntityButtonText: "Add measure",
    editEntityButtonText: "Edit measure",
    deleteModalTitle: "Delete measure?",
    deleteModalConfirmButtonText: "Yes, delete measure",
    deleteModalWarning:
      "You will lose all information entered for this measure. Are you sure you want to proceed?",
    enterReportText: "Enter",
    addEditModalAddTitle: "Add a quality performance measure",
    addEditModalEditTitle: "Edit a quality performance measure",
    drawerTitle: "Report measure results for {{plan}}: {{measureName}}",
  },
  modalForm: {
    id: "dqmmar-modal",
    fields: [
      {
        id: "measure_name",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "D2.VII.1 Measure name",
          hint: "What is the measure name?",
        },
      },
      {
        id: "measure_identifier",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D2.VII.2 Measure identification number or definition",
          hint: [
            {
              type: "span",
              content: "Does this measure have a ",
            },
            {
              type: "externalLink",
              content: "CMS Measures Inventory Tool (CMIT) number",
              props: {
                href: "https://p4qm.org/measures",
                target: "_blank",
                "aria-label": "Measure database (link opens in new tab)",
              },
            },
            {
              type: "span",
              content:
                "? If measurement varied from CMIT or Consensus Based Entity (CBE) specifications, answer “No, it uses neither CMIT or CBE”.",
            },
          ],
          choices: [
            {
              id: "lIqRkso1nUidNG1Gh7Ll0A",
              label: "Yes",
              children: [
                {
                  id: "measure_identifierCmit",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.NUMBER,
                    nested: true,
                    parentFieldName: "measure_identifier",
                    parentOptionId: "lIqRkso1nUidNG1Gh7Ll0A",
                  },
                  props: {
                    label: "CMIT number",
                  },
                },
              ],
            },
            {
              id: "eqVgpF8hmsma9ibcvwVqCb",
              label: "No, it has a Consensus Based Entity (CBE) number",
              children: [
                {
                  id: "measure_identifierCbe",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.NUMBER,
                    nested: true,
                    parentFieldName: "measure_identifier",
                    parentOptionId: "eqVgpF8hmsma9ibcvwVqCb",
                  },
                  props: {
                    label: "Consensus Based Entity (CBE) number",
                  },
                },
              ],
            },
            {
              id: "hcsq9mTy5wWhxUPtgkQWwB",
              label: "No, it uses neither CMIT or CBE",
              children: [
                {
                  id: "measure_identifierDefinition",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "measure_identifier",
                    parentOptionId: "hcsq9mTy5wWhxUPtgkQWwB",
                  },
                  props: {
                    label: "How is this measure defined?",
                    hint: "If this measure has been modified from an existing CMIT or CBE measure, note the CMIT or CBE number and briefly describe the modifications. Otherwise, provide a link to the measure specification. If a link is not available, describe the numerator and denominator and exclusion criteria for each.",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "measure_dataVersion",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D2.VII.3 Data version",
          hint: "Is this data preliminary or final?",
          choices: [
            {
              id: "GLnFjfEWVnsNJdWMswHwxk",
              label: "Preliminary",
            },
            {
              id: "sK8VJLLx8HokhraqqLcH6k",
              label: "Final",
            },
          ],
        },
      },
      {
        id: "measure_activities",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "D2.VII.4 Activities the quality measure is used in ",
          hint: "Which pay-for-performance, quality, or evaluation efforts is this measure used in? Select all that apply.",
          choices: [
            {
              id: "SMRcwYNpSvLf1YTLslsoCP",
              label:
                "Quality Assessment and Performance Improvement (QAPI) program (as defined at 42 CFR 438.330)",
            },
            {
              id: "hUAhCuNQ9FxjJqhX28hJ0f",
              label:
                "Managed Care Quality Strategy (as defined at 42 CFR 438.340)",
            },
            {
              id: "OlWKinxF3sh0LBMaABqP9h",
              label:
                "External Quality Review (EQR) (as defined at 42 CFR 438.450-364)",
            },
            {
              id: "LnCoLFFJScpYddtIoar7ZZ",
              label:
                "Quality Rating System (QRS) (either the state’s own QRS, or as defined at 42 CFR 438.500-535)",
            },
            {
              id: "8RGsv8Wmj0gvQm2UxTTD4g",
              label: "Plan Withholds (as defined at 42 CFR 438.6(b))",
            },
            {
              id: "D4V9Zi6Sk6Z7T5jroDE7Pa",
              label: "Plan Incentives (as defined at 42 CFR 438.6(b))",
            },
            {
              id: "yypoD2k1sqPLumyHKl3wfg",
              label:
                "State Directed Payments (SDPs) (as defined at 42 CFR § 438.6(c)(2)(ii)(C) and (D))",
            },
            {
              id: "SD9JuRdGwpaD0S9yPYc90H",
              label: "In Lieu of Service (ILOS)",
            },
            {
              id: "6c1JMtXyc3riXxf2xHbdVI",
              label: "Other, specify",
              children: [
                {
                  id: "measure_activities-otherText",
                  type: ReportFormFieldType.TEXT,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "measure_activities",
                    parentOptionId: "6c1JMtXyc3riXxf2xHbdVI",
                  },
                },
              ],
            },
            {
              id: "MFK8OOLrIqSP1pHuG8f0pp",
              label: "None",
            },
          ],
        },
      },
      {
        id: "measure_rates_header",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          divider: "none",
          content: "Naming of rates",
          hint: "If there is a total rate specified for this measure, copy the “Measure name” used in D2.VII.2 in the field below for D2.VII.7. If there are multiple rates specified for this measure, refer to the MCPAR Technical Guidance: Quality Measures for more information and examples. For each rate the state is reporting for this measure, enter the name, title, or brief description for the rate used by the measure steward. As noted in the instructions, the state should not report all possible rates for the measure in the MCPAR.",
        },
      },
      {
        id: "measure_rates",
        type: ReportFormFieldType.DYNAMIC,
        validation: ValidationType.DYNAMIC,
        props: {
          label: "D2.VII.7 Name rate",
          hint: "Enter the name of this performance rate you are reporting for the measure.",
        },
      },
    ],
  },
  drawerForm: {
    id: "dqmmar-drawer",
    fields: [
      {
        id: "measure_isReporting",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX_OPTIONAL,
        props: {
          label: "D2.VII.7 Are you reporting results for this measure?",
          hint: "Are you reporting results for this measure for this reporting period?",
          choices: [
            {
              id: "37sMoqg5MNOb17KDCpTO1w",
              label: "Not reporting",
              children: [
                {
                  id: "measure_isNotReportingReason",
                  type: ReportFormFieldType.RADIO,
                  validation: {
                    type: ValidationType.RADIO,
                    nested: true,
                    parentFieldName: "measure_isReporting",
                    parentOptionId: "37sMoqg5MNOb17KDCpTO1w",
                  },
                  props: {
                    choices: [
                      {
                        id: "aKM1awPXFkBfWwesiwKk0p",
                        label:
                          "No, the eligible population does not meet the required measure sample size",
                      },
                      {
                        id: "x37F2dqsuBqjx1BPxQENph",
                        label: "No, this measure does not apply to this plan",
                      },
                      {
                        id: "ZuunP6hiUTIDNzi86PCHBB",
                        label: "Other, specify",
                        children: [
                          {
                            id: "measure_isNotReportingReason-otherText",
                            type: ReportFormFieldType.TEXT,
                            validation: {
                              type: ReportFormFieldType.TEXT,
                              nested: true,
                              parentFieldName: "measure_isNotReportingReason",
                              parentOptionId: "ZuunP6hiUTIDNzi86PCHBB",
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
      {
        id: "measure_section_divider",
        type: ReportFormFieldType.SECTION_DIVIDER,
      },
      {
        id: "measure_dataCollectionMethod",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO_OPTIONAL,
        props: {
          label: "D2.VII.8 Data collection method",
          hint: "What data collection method did the plan use for this measure? (see technical guide for definitions).",
          choices: [
            {
              id: "bkD4uguEEiRjo5GyoCVNMi",
              label: "Administrative",
            },
            {
              id: "tL67PrkzTlW7sYbwvLX20u",
              label: "Electronic clinical data systems (ECDS)",
            },
            {
              id: "ZMOGJqcMYUpz9kfB5U7WKW",
              label: "Electronic health record (EHR)",
            },
            {
              id: "sr81F3S6pBZcmyr4iiBDmR",
              label: "Hybrid",
            },
            {
              id: "UaVA7pFl6zfrYIVFaZXkX0",
              label: "Survey",
            },
            {
              id: "D3x0tz0657GlrkneNtssdn",
              label: "Other, specify",
              children: [
                {
                  id: "measure_dataCollectionMethod-otherText",
                  type: ReportFormFieldType.TEXT,
                  validation: {
                    type: ValidationType.TEXT_OPTIONAL,
                    nested: true,
                    parentFieldName: "measure_dataCollectionMethod",
                    parentOptionId: "D3x0tz0657GlrkneNtssdn",
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
