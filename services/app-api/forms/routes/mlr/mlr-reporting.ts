import {
  EntityType,
  ModalOverlayRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../utils/types";

export const mlrReportingRoute: ModalOverlayRoute = {
  name: "MLR Reporting",
  path: "/mlr/mlr-reporting",
  pageType: PageTypes.MODAL_OVERLAY,
  entityType: EntityType.PROGRAM,
  verbiage: {
    intro: {
      exportSectionHeader: "Program Reporting Information",
      section: "MLR Reporting",
      subsection: "Medicaid Medical Loss Ratio (MLR) & Remittances",
      spreadsheet: "Program Information",
      info: [
        {
          type: "p",
          content:
            "<strong>Total reports should match the number of rows starting at row 31 in Program Information tab. After adding program reporting information, enter the MLR for each report to add its MLR & Remittances.</strong>",
        },
      ],
    },
    exportSectionHeader: "Program Reporting Information",
    dashboardTitle: "MLR report total count:",
    countEntitiesInTitle: true,
    tableHeader:
      "MCO/PIHP/PAHP name <br/> Program name <br/> Eligibility group <br/> MLR reporting period",
    addEntityButtonText: "Add program reporting information",
    editEntityButtonText: "Edit info",
    deleteModalTitle: "Delete program reporting information for this report?",
    deleteModalConfirmButtonText: "Yes, delete report",
    deleteModalWarning:
      "You will lose all information entered for this report. Are you sure you want to proceed?",
    enterReportText: "Enter MLR",
    emptyDashboardText:
      "Add the program reporting information for each MLR report. This information is listed row by row in the Excel Reference's Program Information tab.",
    addEditModalAddTitle: "Add program reporting information",
    addEditModalEditTitle: "Edit program reporting information",
    addEditModalHint:
      "Provide the following program reporting information for each MLR report. This information is listed row by row in the Excel Reference's Program Information tab.",
  },
  modalForm: {
    id: "mlrd-modal",
    fields: [
      {
        id: "report_planName",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "I. MCO, PIHP, or PAHP Name",
          hint: [
            {
              type: "html",
              content:
                "Enter the full name of the plan relevant to this report. Do not abbreviate plan names. All MCOs/PIHPs/PAHPs contracted in a specific program should be reported, including non-credible plans with small enrollment. Plan names should reflect those used in the Medicaid enrollment report: ",
            },
            {
              type: "externalLink",
              content: "“Managed Care Enrollment by Program and Plan”",
              props: {
                href: "https://www.medicaid.gov/medicaid/managed-care/enrollment-report/index.html",
                target: "_blank",
                "aria-label": "Link opens in new tab",
              },
            },
          ],
        },
      },
      {
        id: "report_programName",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "J. Program name",
          hint: "Enter the name of the program(s) for this MLR report. A program is defined by a specified set of benefits and eligibility criteria that are articulated in a contract between the state and managed care plans. States providing plan-level MLR results by program should enter the individual program name in the field below. States providing plan-level MLR results across programs should list all relevant program names in the field below, separated by commas.",
        },
      },
      {
        id: "report_programType",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "K. Program type",
          hint: "Select the program type definition(s) that best describes the program(s) entered in “J. Program name”.",
          choices: [
            {
              id: "G4inXZJWYFsDZYGk75cW7L",
              label: "Comprehensive MCO",
            },
            {
              id: "6krUQZyhpmHHoagQWgUzxx",
              label: "PIHP",
            },
            {
              id: "VNp9mDXgv9ixL2H8JHVBBE",
              label: "PAHP",
            },
            {
              id: "cQhGnyBmiXszLqrx6b2Cp8",
              label: "Behavioral Health",
            },
            {
              id: "PamL56cwvY3Rbdqmnigvve",
              label: "Dental",
            },
            {
              id: "hqjmUS69rVTEKToDxWLXtz",
              label: "MLTSS",
            },
          ],
        },
      },
      {
        id: "report_eligibilityGroup",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "L. Eligibility group",
          hint: [
            {
              type: "span",
              content:
                "Enter the eligibility group for this MLR report. Most states provide MLR reports for all populations. In this case, select “All Populations”. If the state is providing additional detail for specific eligibility groups, see below for instructions related to each group.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "<i>For separate CHIP reporting:</i> States that intend to report MLRs for separate CHIP-only programs should select “Standalone CHIP”. These separate child health assistance programs are defined in 42 CFR § 457.10.",
              props: {
                className: "fake-list-item numbered",
              },
            },
            {
              type: "span",
              content:
                "<i>For SUPPORT Act reporting:</i> States that intend to qualify for the SUPPORT Act Section 4001 MLR provision must provide an MLR for the eligibility group described in section 1902(a)(10)(A)(i)(VIII) (referred to here as “the Expansion Group”). Select “Group VIII Expansion Adult Only”.",
              props: {
                className: "fake-list-item numbered",
              },
            },
            {
              type: "span",
              content:
                "For States that intend to report separate MLRs for eligibility groups that are served under the same program, select “Other, specify”.",
              props: {
                className: "fake-list-item numbered",
              },
            },
          ],
          choices: [
            {
              id: "cRi6qE4T5c6BjbGUsiiEof",
              label: "All Populations",
            },
            {
              id: "UgSDECcYDJ4S39QEMmMRcq",
              label: "Standalone CHIP",
            },
            {
              id: "KWr7SR2JM5UYogD6xZykrN",
              label: "Group VIII Expansion Adult Only",
            },
            {
              id: "4xSRBneHBfUEqSPfrPTRYf",
              label: "Other, specify",
              children: [
                {
                  id: "report_eligibilityGroup-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "report_eligibilityGroup",
                  },
                  props: {
                    label: "M. Eligibility group description",
                    hint: "Describe the eligibility group(s). For example, a State may report separate MLRs for each eligibility group that is included in their “Comprehensive” program: Children <19 years; Aged, Blind, Disabled; Pregnant Women.",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "report_reportingPeriodStartDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.DATE,
        props: {
          label: "N. MLR reporting period start date",
          hint: "Enter the start date of the MLR reporting period. <br/> The MLR reporting period should be a period of 12 months consistent with the rating period. The MLR reporting period must not exceed 12 months. <br/> Note: The remittance reporting period may differ from the MLR reporting period.",
        },
      },
      {
        id: "report_reportingPeriodEndDate",
        type: ReportFormFieldType.DATE,
        validation: {
          type: ValidationType.END_DATE,
          dependentFieldName: "report_reportingPeriodStartDate",
        },
        props: {
          label: "O. MLR reporting period end date",
          hint: "Enter the end date of the MLR reporting period.",
          timetype: "endDate",
        },
      },
      {
        id: "report_reportingPeriodDiscrepancy",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "P.1 Reporting period discrepancy",
          hint: "Is the reporting period less than 12 months or does the MCO/PIHP/PAHP have a different reporting period than other MCO/PIHP/PAHPs within the same program?",
          choices: [
            {
              id: "2NI2TmkWrS70g3U6adRKklWSv31",
              label: "Yes",
              children: [
                {
                  id: "report_reportingPeriodDiscrepancyExplanation",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "report_reportingPeriodDiscrepancy",
                    parentOptionId: "2NI2TmkWrS70g3U6adRKklWSv31",
                  },
                  props: {
                    label: "P.2 Explanation of reporting period discrepancy",
                    hint: "Include a qualitative response. Examples may include: implementation of a new program, a plan exiting the market, or re-alignment of the reporting period from calendar year to a state fiscal year.",
                  },
                },
              ],
            },
            {
              id: "2NI2UTNqhvrJLvEv8SORD7vIPRI",
              label: "No",
            },
          ],
        },
      },
      {
        id: "report_miscellaneousNotes",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "Q. Miscellaneous notes",
          hint: "Include any other notes or detail for CMS.",
          styleAsOptional: true,
        },
      },
    ],
  },
  overlayForm: {
    id: "mlrd-overlay",
    fields: [
      {
        id: "mlrSection1Header",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          divider: "top",
          content: "1. Medical Loss Ratio Numerator",
        },
      },
      {
        id: "report_incurredClaims",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        props: {
          label: "1.1 Incurred claims",
          hint: "Enter incurred claims (optional subcomponent of section 1.3 MLR numerator). <br /> <a href='https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(e)(2)' target='_blank'>42 CFR § 438.8(e)(2)</a>",
          mask: "currency",
          styleAsOptional: true,
        },
      },
      {
        id: "report_healthCareQualityImprovementActivities",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        props: {
          label: "1.2 Activities that improve health care quality",
          hint: "Enter activities that improve health care quality (optional subcomponent of section 1.3 MLR numerator). <br /> <a href='https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(e)(3)' target='_blank'> 42 CFR § 438.8(e)(3) </a>",
          mask: "currency",
          styleAsOptional: true,
        },
      },
      {
        id: "report_mlrNumerator",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_NOT_LESS_THAN_ONE,
        props: {
          label: "1.3 MLR numerator",
          hint: "Enter the required MLR numerator dollar value. If the optional subcomponents are reported in 1.1-1.2, states must still report the total MLR numerator (i.e., subcomponents will not automatically sum to numerator). <br /> <a href='https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(e)(1)' target='_blank'>42 CFR § 438.8(e)(1)</a>",
          mask: "currency",
        },
      },
      {
        id: "report_mlrNumeratorExplanation",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "Medical Loss Ratio numerator explanation",
          hint: "If the optional subcomponents are reported in sections 1.1 and 1.2 and they do not equal the total reported <i>MLR numerator</i> in section 1.3, states may provide an explanation here.",
          styleAsOptional: true,
        },
      },
      {
        id: "report_nonClaimsCosts",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        props: {
          label: "1.4 Non-claims costs (not included in numerator)",
          hint: "Enter the non-claims costs value. This amount is not included in the MLR numerator. <br /> <a href='https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(e)(2)(v)(A)' target='_blank'>42 CFR § 438.8(e)(2)(v)(A)</a>",
          mask: "currency",
          styleAsOptional: true,
        },
      },
      {
        id: "mlrSection2Header",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          divider: "top",
          content: "2. Medical Loss Ratio Denominator",
        },
      },
      {
        id: "report_premiumRevenue",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        props: {
          label: "2.1 Premium revenue",
          hint: "Enter premium revenue (optional subcomponent of section 2.3 MLR denominator). <br /> <a href='https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(f)(2)' target='_blank'> 42 CFR § 438.8(f)(2) </a>",
          mask: "currency",
          styleAsOptional: true,
        },
      },
      {
        id: "report_taxesLicensingRegulatoryFees",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        props: {
          label:
            "2.2 Federal, State, and local taxes and licensing and regulatory fees",
          hint: "Enter Federal, State, and local taxes and licensing; and regulatory fees (optional subcomponent of section 2.3 MLR denominator). <br /> <a href='https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(f)(3)' target='_blank'> 42 CFR § 438.8(f)(3) </a>",
          mask: "currency",
          styleAsOptional: true,
        },
      },
      {
        id: "report_mlrDenominator",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_NOT_LESS_THAN_ONE,
        props: {
          label: "2.3 MLR denominator",
          hint: "Enter the required MLR denominator dollar value. If the optional subcomponents are reported in sections 2.1 - 2.2, states must still report the total MLR denominator (i.e., subcomponents will not automatically sum to denominator). <br/> <a href='https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(f)(1)' target='_blank'> 42 CFR § 438.8(f)(1)</a>",
          mask: "currency",
        },
      },
      {
        id: "report_mlrDenominatorExplanation",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "Medical Loss Ratio denominator explanation",
          hint: "If the optional subcomponents are reported in sections 2.1 and 2.2 and the reported <i>Premium Revenue</i> less the reported <i>Federal, State, and local taxes and licensing and regulatory fees</i> does not equal the total reported <i>MLR denominator</i> in section 2.3, states may provide an explanation here.",
          styleAsOptional: true,
        },
      },
      {
        id: "mlrSection3Header",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          divider: "top",
          content: "3. MLR Calculation",
        },
      },
      {
        id: "report_requiredMemberMonths",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_NOT_LESS_THAN_ONE,
        props: {
          label: "3.1 Member months",
          mask: "comma-separated",
          hint: "Enter the required number of member months. <br /> <a href='https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(b)' target='_blank'> 42 CFR § 438.8(b) </a>",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "report_unadjustedMlrPercentage",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        props: {
          label: "3.2 Unadjusted MLR",
          hint: "Enter the percentage exactly as the percentage should appear (rounded to nearest tenth). Entering '1' will result in 1% instead of 100%. (optional subcomponent of section 3.4 Adjusted MLR)",
          mask: "percentage",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 2,
        },
      },
      {
        id: "report_unadjustedMlrPercentageExplanation",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "Unadjusted MLR explanation",
          hint: "If the optional <i>Unadjusted MLR</i> reported in section 3.2 does not equal the ratio of the <i>MLR numerator</i> over the <i>MLR denominator</i> (as reported in sections 1.3 and 2.3), states may provide an explanation here.",
          styleAsOptional: true,
        },
      },
      {
        id: "report_credibilityAdjustmentPercentage",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        props: {
          label: "3.3 Credibility adjustment",
          hint: [
            {
              type: "span",
              content:
                "Enter the percentage exactly as the percentage should appear (rounded to nearest tenth). (Optional subcomponent of section 3.4 Adjusted MLR)",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content: "Enter 0% if no credibility adjustment is needed.",
              props: {
                className: "fake-list-item",
              },
            },
            {
              type: "span",
              content:
                "For non-credible plans, the credibility adjustment should be rounded to the nearest tenth and entered up to 100%.",
              props: {
                className: "fake-list-item",
              },
            },
            {
              type: "span",
              content:
                "For fully credible plans, the credibility adjustment should be entered as 0%.",
              props: {
                className: "fake-list-item",
              },
            },
            {
              type: "html",
              content:
                "<a href='https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(h)' target='_blank'>42 CFR § 438.8(h)</a>",
            },
          ],
          mask: "percentage",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 1,
        },
      },
      {
        id: "report_adjustedMlrPercentage",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_NOT_LESS_THAN_ONE,
        props: {
          label: "3.4 Adjusted MLR",
          hint: "Enter the required percentage. If the optional subcomponents are reported in sections 3.2 - 3.3, states must still report the total adjusted MLR value (i.e., subcomponents will not automatically calculate adjusted MLR). For information on credibility adjustments see <br /> <a href='https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(h)' target='_blank'> 42 CFR § 438.8(h). </a>",
          mask: "percentage",
          decimalPlacesToRoundTo: 2,
        },
      },
      {
        id: "report_adjustedMlrPercentageExplanation",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "Adjusted MLR atypical range explanation",
          hint: "If the <i>Adjusted MLR</i> reported in section 3.4 is outside of the typical range and is either greater than 110% or less than 70%, states may provide an explanation here. For information on credibility adjustments see <br /> <a href='https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(h)' target='_blank'> 42 CFR § 438.8(h).</a>",
          styleAsOptional: true,
        },
      },
      {
        id: "mlrSection4Header",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          divider: "top",
          content: "4. Remittance",
        },
      },
      {
        id: "mlrSection4Content",
        type: ReportFormFieldType.SECTION_CONTENT,
        props: {
          content:
            "Complete the series of questions related to MLR remittances below. Based on your responses, required follow-up indicators will appear. All amounts should be reported as absolute values.",
        },
      },
      {
        id: "report_contractIncludesMlrRemittanceRequirement",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "4.1 Does the contract include a remittance/payment requirement for being below/above a specified MLR?",
          hint: "This element indicates if a remittance to the state or a payment to a plan is required in an MCO/PIHP/PAHP contract if a minimum MLR is not met.",
          choices: [
            {
              id: "UL4dAeyyvCFAXttxZioacR",
              label: "No",
            },
            {
              id: "7FP4jcg4jK7Ssqp3cCW5vQ",
              label: "Yes",
              children: [
                {
                  id: "state_minimumMlrRequirement",
                  validation: {
                    type: ValidationType.NUMBER_OPTIONAL,
                    nested: true,
                    parentFieldName:
                      "report_contractIncludesMlrRemittanceRequirement",
                    parentOptionId: "7FP4jcg4jK7Ssqp3cCW5vQ",
                  },
                  type: ReportFormFieldType.NUMBER,
                  props: {
                    label: "4.2 What is the State minimum MLR requirement?",
                    mask: "percentage",
                    styleAsOptional: true,
                    decimalPlacesToRoundTo: 2,
                  },
                },
                {
                  id: "state_doesStateRemittanceMlrCalculationAlign",
                  type: ReportFormFieldType.RADIO,
                  styleAsOptional: true,
                  validation: {
                    type: ValidationType.RADIO_OPTIONAL,
                    nested: true,
                    parentFieldName:
                      "report_contractIncludesMlrRemittanceRequirement",
                    parentOptionId: "7FP4jcg4jK7Ssqp3cCW5vQ",
                  },
                  props: {
                    label:
                      "4.3 Does the state remittance MLR calculation align with the required components and methodology outlined in 438.8(c)?",
                    styleAsOptional: true,
                    choices: [
                      {
                        id: "PpL7niYGJMaY2fgv7R8C7g",
                        label: "Yes",
                      },
                      {
                        id: "hReMcaoqUfknjTM7dhZK3N",
                        label: "No",
                        children: [
                          {
                            id: "state_remittanceMlrCalculationDeterminationMethod",
                            type: ReportFormFieldType.TEXTAREA,
                            validation: {
                              nested: true,
                              parentFieldName:
                                "state_doesStateRemittanceMlrCalculationAlign",
                              type: ValidationType.TEXT_OPTIONAL,
                              parentOptionId: "hReMcaoqUfknjTM7dhZK3N",
                            },
                            props: {
                              label:
                                "4.4 State-defined remittance MLR calculation description",
                              hint: "Describe the method by which the state determines remittance MLR calculations.",
                              styleAsOptional: true,
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
                {
                  id: "report_calculatedMlrPercentageForRemittancePurposes",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.NUMBER_OPTIONAL,
                    nested: true,
                    parentFieldName:
                      "report_contractIncludesMlrRemittanceRequirement",
                    parentOptionId: "7FP4jcg4jK7Ssqp3cCW5vQ",
                  },
                  props: {
                    label: "4.5 Calculated MLR for remittance purposes",
                    hint: "Report the calculated MLR for remittance purposes (please enter as a percentage).",
                    mask: "percentage",
                    styleAsOptional: true,
                    decimalPlacesToRoundTo: 2,
                  },
                },
                {
                  id: "report_remittanceDollarAmountOwed",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.NUMBER_NOT_LESS_THAN_ZERO,
                    nested: true,
                    parentFieldName:
                      "report_contractIncludesMlrRemittanceRequirement",
                    parentOptionId: "7FP4jcg4jK7Ssqp3cCW5vQ",
                  },
                  props: {
                    label:
                      "4.6.1 Remittance dollar amount owed for MLR reporting period",
                    hint: "Report the amount of remittances owed by this plan. Enter a zero (0) value if no remittance was owed by a plan. Enter a positive value if a remittance was collected by the state.",
                    mask: "currency",
                  },
                },
                {
                  id: "report_remittanceDollarAmountDue",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.NUMBER_OPTIONAL,
                    nested: true,
                    parentFieldName:
                      "report_contractIncludesMlrRemittanceRequirement",
                    parentOptionId: "7FP4jcg4jK7Ssqp3cCW5vQ",
                  },
                  props: {
                    label:
                      "4.6.2 Payment dollar amount due to plan for MLR reporting period",
                    hint: "Report the amount of the payment due to this plan as a positive value, if applicable. This payment is specific to losses reimbursed under a minimum MLR arrangement; do not report the results of other risk corridors, reinsurance or other risk mitigation arrangements. If states do not make payments to plans for losses under a minimum MLR arrangement, states may enter $0.",
                    mask: "currency",
                    styleAsOptional: true,
                  },
                },
                {
                  id: "report_remittanceExplanation",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    nested: true,
                    parentFieldName:
                      "report_contractIncludesMlrRemittanceRequirement",
                    type: ValidationType.TEXT_OPTIONAL,
                    parentOptionId: "7FP4jcg4jK7Ssqp3cCW5vQ",
                  },
                  props: {
                    label: "Remittance explanation",
                    hint: "A state cannot simultaneously owe remittances to and require payment from a Medicaid managed care plan. If the state reported a <i>Remittance amount owed</i> greater than $0 in section 4.6.1 and an optional <i>Payment amount due to plan</i> greater than $0 in section 4.6.2, states may provide an explanation here.",
                    styleAsOptional: true,
                  },
                },
                {
                  id: "report_reportingPeriodStartDate",
                  type: ReportFormFieldType.DATE,
                  props: {
                    label: "N. MLR reporting period start date",
                    hint: "Auto-populates from program reporting information.",
                    disabled: true,
                    clear: false,
                  },
                },
                {
                  id: "report_reportingPeriodEndDate",
                  type: ReportFormFieldType.DATE,
                  props: {
                    label: "O. MLR reporting period end date",
                    hint: "Auto-populates from program reporting information.",
                    disabled: true,
                    clear: false,
                  },
                },
                {
                  id: "report_isRemittancePeriodSameAsMlrReportingPeriod",
                  type: ReportFormFieldType.RADIO,
                  validation: {
                    nested: true,
                    parentFieldName:
                      "report_contractIncludesMlrRemittanceRequirement",
                    type: ValidationType.RADIO_OPTIONAL,
                    parentOptionId: "7FP4jcg4jK7Ssqp3cCW5vQ",
                  },
                  props: {
                    label:
                      "4.7 Is the remittance period the same as the MLR reporting period?",
                    hint: "Is the remittance period the same as the MLR reporting period reported under N and O (displayed above)? <br /> The remittance period is the period of time used when determining the remittance amounts.",
                    styleAsOptional: true,
                    choices: [
                      {
                        id: "YzV3x7cp3u2sX92V3cbpDM",
                        label: "Yes",
                      },
                      {
                        id: "3dkx7LnSCiEUeibYshCBrf",
                        label: "No",
                        children: [
                          {
                            id: "report_remittancePeriodStartDate",
                            type: ReportFormFieldType.DATE,
                            validation: {
                              type: ValidationType.DATE_OPTIONAL,
                              nested: true,
                              parentFieldName:
                                "report_isRemittancePeriodSameAsMlrReportingPeriod",
                              parentOptionId: "3dkx7LnSCiEUeibYshCBrf",
                            },
                            props: {
                              label: "4.8.1 Remittance period start date",
                              hint: "Enter the start date of the remittance period.",
                              styleAsOptional: true,
                            },
                          },
                          {
                            id: "report_remittancePeriodEndDate",
                            type: ReportFormFieldType.DATE,
                            validation: {
                              type: ValidationType.DATE_OPTIONAL,
                              nested: true,
                              parentFieldName:
                                "report_isRemittancePeriodSameAsMlrReportingPeriod",
                              parentOptionId: "3dkx7LnSCiEUeibYshCBrf",
                            },
                            props: {
                              label: "4.8.2 Remittance period end date",
                              hint: "Enter the end date of the remittance period.",
                              styleAsOptional: true,
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
                {
                  id: "report_stateFederalRemittanceShareDeterminationMethodologyDescription",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName:
                      "report_contractIncludesMlrRemittanceRequirement",
                    parentOptionId: "7FP4jcg4jK7Ssqp3cCW5vQ",
                  },
                  props: {
                    label: "4.9 Remittance methodology qualitative response",
                    hint: [
                      {
                        type: "span",
                        content:
                          "Describe the methodology used to determine the State and Federal share of the remittance.",
                        props: {
                          className: "fake-paragraph-break",
                        },
                      },
                      {
                        type: "span",
                        content:
                          "States that intend to qualify for the SUPPORT Act Section 4001 MLR provision must provide a description of the methodology used to determine the State and Federal share of the remittance for the eligibility group described in section 1902(a)(10)(A)(i)(VIII)",
                        props: {
                          className: "fake-paragraph-break",
                        },
                      },
                      {
                        type: "span",
                        content:
                          "<a href='https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-B/section-438.74#p-438.74(b)(2)' target='_blank'>42 CFR § 438.74(b)(2)</a>",
                        props: {
                          className: "fake-paragraph-break",
                        },
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
