import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const encounterDataReportRoute: FormRoute = {
  name: "III: Encounter Data Report",
  path: "/mcpar/program-level-indicators/encounter-data-report",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section C: Program-Level Indicators",
      subsection: "Topic III: Encounter Data Report",
      spreadsheet: "C1_Program_Set",
    },
  },
  form: {
    id: "cedr",
    fields: [
      {
        id: "program_encounterDataUses",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "C1.III.1 Uses of encounter data",
          hint: "For what purposes does the state use encounter data collected from managed care plans (MCPs)? Select one or more.<br/>Federal regulations require that states, through their contracts with MCPs, collect and maintain sufficient enrollee encounter data to identify the provider who delivers any item(s) or service(s) to enrollees (42 CFR 438.242(c)(1)).",
          choices: [
            {
              id: "eSrOkLMTyEmmixeqNXV1ZA",
              label: "Rate setting",
            },
            {
              id: "Ga9PZEVDBEOZULWeJdJznw",
              label: "Quality/performance measurement",
            },
            {
              id: "OF4juaUqz0GrUVVzvHjuEA",
              label: "Monitoring and reporting",
            },
            {
              id: "n8IjGT6b60qpp5KCHAJeyA",
              label: "Contract oversight",
            },
            {
              id: "6JVi42VKSEO39fJSma8BzA",
              label: "Program integrity",
            },
            {
              id: "RuBQRzexDUeq9St0E6sJdw",
              label: "Policy making and decision support",
            },
            {
              id: "Lxb161V64E27MlzL7boAFw",
              label: "Other, specify",
              children: [
                {
                  id: "program_encounterDataUses-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "program_encounterDataUses",
                  },
                },
              ],
            },
            {
              id: "WeIIplvIUEiCMdD2qKNz9w",
              label: "Encounter data not used for any purpose",
            },
          ],
        },
      },
      {
        id: "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "C1.III.2 Criteria/measures to evaluate MCP performance",
          hint: "What types of measures are used by the state to evaluate managed care plan performance in encounter data submission and correction? Select one or more.<br/>Federal regulations also require that states validate that submitted enrollee encounter data they receive is a complete and accurate representation of the services provided to enrollees under the contract between the state and the MCO, PIHP, or PAHP. 42 CFR 438.242(d).",
          choices: [
            {
              id: "kP5W9deIb06jK7SXX8dnRA",
              label: "Timeliness of initial data submissions",
            },
            {
              id: "rsqVEBVarkij4Ks9vmgE3g",
              label: "Timeliness of data corrections",
            },
            {
              id: "Lo4seplZ3UGTktvCFuAtqw",
              label: "Timeliness of data certifications",
            },
            {
              id: "448Z26i8ikOhiFzqbdkeNg",
              label: "Use of correct file formats",
            },
            {
              id: "auYEK7okWkSc1hSwsYaAVQ",
              label: "Provider ID field complete",
            },
            {
              id: "mmtZcSBPUkGPCpQqc9wkyg",
              label:
                "Overall data accuracy (as determined through data validation)",
            },
            {
              id: "J8l0u9V4VEeQmiZCB5Djrg",
              label: "Other, specify",
              children: [
                {
                  id: "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName:
                      "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria",
                  },
                },
              ],
            },
            {
              id: "FrCigNtArkCCqdkxU8fjlA",
              label: "None of the above",
            },
          ],
        },
      },
      {
        id: "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteriaContractLanguageLocation",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label:
            "C1.III.3 Encounter data performance criteria contract language",
          hint: "Provide reference(s) to the contract section(s) that describe the criteria by which managed care plan performance on encounter data submission and correction will be measured. Use contract section references, not page numbers.",
        },
      },
      {
        id: "program_encounterDataSubmissionQualityFinancialPenaltiesContractLanguageLocation",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "C1.III.4 Financial penalties contract language",
          hint: "Provide reference(s) to the contract section(s) that describes any financial penalties the state may impose on plans for the types of failures to meet encounter data submission and quality standards. Use contract section references, not page numbers.",
        },
      },
      {
        id: "program_encounterDataQualityIncentives",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "C1.III.5 Incentives for encounter data quality",
          hint: "Describe the types of incentives that may be awarded to managed care plans for encounter data quality. Reply with “N/A” if the plan does not use incentives to award encounter data quality.",
        },
      },
      {
        id: "program_encounterDataCollectionValidationBarriers",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "C1.III.6 Barriers to collecting/validating encounter data",
          hint: "Describe any barriers to collecting and/or validating managed care plan encounter data that the state has experienced during the reporting year. If there were no barriers, please enter “The state did not experience any barriers to collecting or validating encounter data during the reporting year” as your response. “N/A” is not an acceptable response.",
        },
      },
    ],
  },
};
