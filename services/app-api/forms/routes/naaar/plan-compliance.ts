import {
  EntityType,
  MultiformRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../utils/types";

export const planComplianceRoute: MultiformRoute = {
  name: "III. Plan compliance",
  path: "/naaar/plan-compliance",
  pageType: PageTypes.PLAN_OVERLAY,
  entityType: EntityType.PLANS,
  verbiage: {
    intro: {
      section: "",
      subsection: "III. Plan compliance",
      info: [
        {
          type: ReportFormFieldType.TEXT,
          content:
            "Use this section to report on plan compliance with the state’s standards, as required at 42 C.F.R. § 438.68. This section is also used to report on plan compliance with 42 C.F.R. § 438.206 standards.",
        },
      ],
    },
    requiredMessages: {
      plans: [
        {
          type: "div",
          children: [
            {
              type: "p",
              content:
                "This program is missing required information. You won’t be able to access this section until you’ve completed all the required questions in section I.",
            },
            {
              type: "ul",
              children: [
                {
                  type: "li",
                  children: [
                    {
                      type: "internalLink",
                      content: "Add plans",
                      props: {
                        to: "/naaar/state-and-program-information/add-plans",
                      },
                    },
                  ],
                },
                {
                  type: "li",
                  children: [
                    {
                      type: "internalLink",
                      content: "Provider type coverage",
                      props: {
                        to: "/naaar/state-and-program-information/provider-type-coverage",
                      },
                    },
                  ],
                },
                {
                  type: "li",
                  children: [
                    {
                      type: "internalLink",
                      content: "Analysis methods",
                      props: {
                        to: "/naaar/state-and-program-information/analysis-methods",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      standards: [
        {
          type: "p",
          children: [
            {
              type: "html",
              content:
                "This program is missing standards. You won’t be able to access this section until you’ve added standards in section ",
            },
            {
              type: "internalLink",
              content:
                "II. Program-level access and network adequacy standards",
              props: {
                to: "/naaar/program-level-access-and-network-adequacy-standards",
              },
            },
            {
              type: "span",
              content: ".",
            },
          ],
        },
      ],
    },
    tableHeader: "Plan name",
    enterEntityDetailsButtonText: "Enter",
  },
  details: {
    verbiage: {
      backButton: "Return to plan compliance dashboard",
      intro: {
        info: "Use this section to report on plan compliance with the state’s standards, as required at 42 C.F.R. § 438.68. This section is also used to report on plan compliance with 42 C.F.R. § 438.206 standards.",
        section: "",
        subsection: "Plan compliance data for {{planName}}",
      },
    },
    forms: [
      {
        form: {
          id: "planCompliance43868",
          fields: [
            {
              id: "planCompliance43868_assurance",
              type: ReportFormFieldType.RADIO,
              validation: ValidationType.RADIO,
              props: {
                choices: [
                  {
                    id: "Jtt1p8Z9HtpRWN2E8lxzni",
                    label:
                      "Yes, the plan complies on all standards based on all analyses",
                  },
                  {
                    id: "dq36WGX8Ev8wmALi1rg3bv",
                    label:
                      "No, the plan does not comply on all standards based on all analyses or exceptions granted",
                  },
                ],
              },
            },
          ],
        },
        table: {
          bodyRows: [
            [
              "",
              "Select “Enter/Edit” to provide details on standards that were either non-compliant or for which an exception was granted",
              "",
            ],
          ],
          caption: "A. Assurance of plan compliance for 438.68",
          headRow: [
            { hiddenName: "Status" },
            { hiddenName: "Report section" },
            { hiddenName: "Action" },
          ],
        },
        verbiage: {
          heading: "A. Assurance of plan compliance for 438.68",
          hint: "III.A.1 Indicate whether the state assures that the plan complies with the state’s standards, as required at § 42 C.F.R. 438.68 (i.e., the standards previously entered by the state) based on each analysis the state conducted for the plan during the reporting period.",
          intro: {
            section: "",
          },
        },
      },
      {
        form: {
          id: "planCompliance438206",
          fields: [
            {
              id: "planCompliance438206_assurance",
              type: ReportFormFieldType.RADIO,
              validation: ValidationType.RADIO,
              props: {
                choices: [
                  {
                    id: "a4BjUY8odfV5TSNKHtFVGd",
                    label:
                      "Yes, the plan complies on all standards based on all analyses",
                  },
                  {
                    id: "zC8SPm68FS8xI9igWQ0BdP",
                    label:
                      "No, the plan does not comply with all standards based on all analyses or exceptions granted",
                  },
                ],
              },
            },
          ],
        },
        table: {
          bodyRows: [
            [
              "",
              "Provide plan compliance details for the requirements at 42 C.F.R. § 438.206",
              "",
            ],
          ],
          caption: "B. Assurance of plan compliance for 438.206",
          headRow: [
            { hiddenName: "Status" },
            { hiddenName: "Report section" },
            { hiddenName: "Action" },
          ],
        },
        verbiage: {
          accordion: {
            buttonLabel:
              "Review the availability of services requirements at 42 C.F.R. § 438.206",
            text: [
              {
                type: "p",
                content:
                  "The following is an excerpt from the current regulations in effect at 438.206(b)-(c):",
              },
              {
                type: "p",
                children: [
                  {
                    type: "html",
                    content:
                      "(a) <b>Basic rule.</b> Each State must ensure that all services covered under the State plan are available and accessible to enrollees of MCOs, PIHPs, and PAHPs in a timely manner. The State must also ensure that MCO, PIHP and PAHP provider networks for services covered under the contract meet the standards developed by the State in accordance with ",
                  },
                  {
                    type: "externalLink",
                    content: "§ 438.68",
                    props: {
                      href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-B/section-438.68",
                      target: "_blank",
                      "aria-label": "§ 438.68 (link opens in new tab).",
                    },
                  },
                  {
                    type: "html",
                    content: ".",
                  },
                ],
              },
              {
                type: "p",
                content:
                  "(b) <b>Delivery network.</b> The State must ensure, through its contracts, that each MCO, PIHP and PAHP, consistent with the scope of its contracted services, meets the following requirements:",
              },
              {
                type: "ol",
                props: {
                  className: "ordered-list-parentheses",
                },
                children: [
                  {
                    type: "li",
                    content:
                      "Maintains and monitors a network of appropriate providers that is supported by written agreements and is sufficient to provide adequate access to all services covered under the contract for all enrollees, including those with limited English proficiency or physical or mental disabilities.",
                  },
                  {
                    type: "li",
                    content:
                      "Provides female enrollees with direct access to a women’s health specialist within the provider network for covered care necessary to provide women’s routine and preventive health care services. This is in addition to the enrollee’s designated source of primary care if that source is not a women’s health specialist.",
                  },
                  {
                    type: "li",
                    content:
                      "Provides for a second opinion from a network provider, or arranges for the enrollee to obtain one outside the network, at no cost to the enrollee.",
                  },
                  {
                    type: "li",
                    content:
                      "If the provider network is unable to provide necessary services, covered under the contract, to a particular enrollee, the MCO, PIHP, or PAHP must adequately and timely cover these services out of network for the enrollee, for as long as the MCO, PIHP, or PAHP’s provider network is unable to provide them.",
                  },
                  {
                    type: "li",
                    content:
                      "Requires out-of-network providers to coordinate with the MCO, PIHP, or PAHP for payment and ensures the cost to the enrollee is no greater than it would be if the services were furnished within the network.",
                  },
                  {
                    type: "li",
                    children: [
                      {
                        type: "html",
                        content:
                          "Demonstrates that its network providers are credentialed as required by ",
                      },
                      {
                        type: "externalLink",
                        content: "§ 438.214",
                        props: {
                          href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-D/section-438.214",
                          target: "_blank",
                          "aria-label": "§ 438.214 (link opens in new tab).",
                        },
                      },
                      {
                        type: "html",
                        content: ".",
                      },
                    ],
                  },
                  {
                    type: "li",
                    content:
                      "Demonstrates that its network includes sufficient family planning providers to ensure timely access to covered services.",
                  },
                ],
              },
              {
                type: "p",
                content:
                  "(c) <b>Furnishing of services.</b> The State must ensure that each contract with a MCO, PIHP, and PAHP complies with the following requirements.",
              },
              {
                type: "ol",
                props: {
                  className: "indented-list",
                },
                children: [
                  {
                    type: "li",
                    children: [
                      {
                        type: "html",
                        content:
                          "<b>Timely access.</b> Each MCO, PIHP, and PAHP must do the following:",
                      },
                      {
                        type: "ol",
                        props: {
                          className: "marker-normal",
                        },
                        children: [
                          {
                            type: "li",
                            content:
                              "Meet and require its network providers to meet State standards for timely access to care and services, taking into account the urgency of the need for services.",
                          },
                          {
                            type: "li",
                            content:
                              "Ensure that the network providers offer hours of operation that are no less than the hours of operation offered to commercial enrollees or comparable to Medicaid FFS, if the provider serves only Medicaid enrollees.",
                          },
                          {
                            type: "li",
                            content:
                              "Make services included in the contract available 24 hours a day, 7 days a week, when medically necessary.",
                          },
                          {
                            type: "li",
                            content:
                              "Establish mechanisms to ensure compliance by network providers.",
                          },
                          {
                            type: "li",
                            content:
                              "Monitor network providers regularly to determine compliance.",
                          },
                          {
                            type: "li",
                            content:
                              "Take corrective action if there is a failure to comply by a network provider.",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: "li",
                    content:
                      "<b>Access and cultural considerations.</b> Each MCO, PIHP, and PAHP participates in the State’s efforts to promote the delivery of services in a culturally competent manner to all enrollees, including those with limited English proficiency and diverse cultural and ethnic backgrounds, disabilities, and regardless of sex which includes sex characteristics, including intersex traits; pregnancy or related conditions; sexual orientation; gender identity and sex stereotypes.",
                  },
                  {
                    type: "li",
                    content:
                      "<b>Accessibility considerations.</b> Each MCO, PIHP, and PAHP must ensure that network providers provide physical access, reasonable accommodations, and accessible equipment for Medicaid enrollees with physical or mental disabilities.",
                  },
                ],
              },
              {
                type: "p",
                children: [
                  {
                    type: "html",
                    content:
                      "(d) <b>Applicability date.</b> States will not be held out of compliance with the requirements of ",
                  },
                  {
                    type: "externalLink",
                    content: "paragraphs (c)(1)(i)",
                    props: {
                      href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-D/section-438.206#p-438.206s(c)(1)(i)",
                      target: "_blank",
                      "aria-label":
                        "Paragraphs (c)(1)(i) (link opens in new tab).",
                    },
                  },
                  {
                    type: "html",
                    content:
                      "of this section prior to the first rating period that begins on or after 3 years after July 9, 2024, so long as they comply with the corresponding standard(s) codified in ",
                  },
                  {
                    type: "externalLink",
                    content: "42 CFR 438.206(c)(1)(i)",
                    props: {
                      href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-D/section-438.206#p-438.206(c)(1)(i)",
                      target: "_blank",
                      "aria-label":
                        "42 CFR 438.206(c)(1)(i) (link opens in new tab).",
                    },
                  },
                  {
                    type: "html",
                    content: " (effective as of October 1, 2023).",
                  },
                ],
              },
            ],
          },
          heading: "B. Assurance of plan compliance for 438.206",
          hint: "III.B.1 Indicate whether the state assures that the plan complies with the availability of services standards outlined in 42 C.F.R. § 438.206 the analyses the state conducted for the plan during the reporting period.",
        },
      },
    ],
    childForms: [
      {
        parentForm: "planCompliance43868",
        verbiage: {
          backButton:
            "Return to {{planName}}: Select non-compliant / exception standards for 42 C.F.R. § 438.68 dashboard",
          intro: {
            hint: "Report details on this standard by selecting whether the plan was non-compliant with the standard listed above during the reporting period and if an exception was granted. If the plan is fully compliant with this standard, do not complete this section and return to the plan compliance dashboard.",
            info: [
              {
                type: "p",
                children: [
                  {
                    type: "html",
                    content:
                      "<strong>Plan non-compliance for 42 C.F.R. § 438.68</strong>",
                  },
                ],
              },
            ],
            section: "III. Plan compliance data for {{planName}}",
            subsection:
              "{{planName}}: Provide details about plan non-compliance or exceptions for this standard",
          },
        },
        table: {
          caption: "42 C.F.R. § 438.68 standards",
          sortableHeadRow: {
            exceptionsNonCompliance: { header: "N/E" },
            count: { header: "#" },
            provider: { header: "Provider type" },
            standardType: { header: "Standard type" },
            description: { header: "Standard description" },
            population: { header: "Population" },
            region: { header: "Region" },
            actions: { header: "Actions", hidden: true },
          },
          verbiage: {
            backButton:
              "Return to plan compliance data for {{planName}} dashboard",
            intro: {
              hint: "Select “Enter” for all of the standards that are not compliant or have an exception granted for the state’s 42 C.F.R. § 438.68 standards for the plan listed above. If a standard is fully compliant, you do not need to enter any additional information for that standard.",
              section: "III. Plan compliance data for {{planName}}",
              subsection:
                "Select non-compliant or exception standards for 42 C.F.R. § 438.68",
            },
            totals: {
              nonCompliant:
                "“N” indicates a standard for which the plan is non-compliant. Total count:",
              exceptions:
                "“E” indicates a standard for which the plan has been granted an exception. Total count:",
            },
          },
        },
        form: {
          id: "planCompliance43868_details",
          fields: [
            {
              id: "planCompliance43868_standard",
              type: ReportFormFieldType.CHECKBOX,
              validation: ValidationType.CHECKBOX_ONE_OPTIONAL,
              props: {
                label: "The plan does not meet this standard",
                hint: "Select if plan does not fully comply with this standard based on at least one analysis conducted within the reporting period or if an exception was granted.",
                choices: [
                  {
                    id: "l8yWzYniMtH5HQrBIjwApO",
                    label: "III.C.1 Plan is non-compliant for this standard",
                    children: [
                      {
                        id: "planCompliance43868_standard-nonComplianceAnalyses",
                        type: ReportFormFieldType.CHECKBOX,
                        validation: {
                          type: ValidationType.CHECKBOX,
                          nested: true,
                          parentFieldName: "planCompliance43868_standard",
                          parentOptionId: "l8yWzYniMtH5HQrBIjwApO",
                        },
                        props: {
                          label:
                            "III.C.2a Plan deficiencies: analyses used to identify deficiencies with this standard",
                          hint: "Indicate which analyses reflect the deficiencies. If the analysis method does not appear here, return to “Standards” and add it. If geomapping, provider directory reviews, or secret shopper results are the methods used, additional fields will appear to enable reporting of more specific results from those analyses.",
                          choices: [
                            {
                              label: "Geomapping",
                              children: [
                                {
                                  id: "geomappingComplianceFrequency",
                                  type: ReportFormFieldType.CHECKBOX,
                                  validation:
                                    ValidationType.CHECKBOX_ONE_OPTIONAL,
                                  props: {
                                    label:
                                      "Frequency of compliance findings (optional)",
                                    hint: "States may report additional details on the results produced from using geomapping, plan provider directory reviews, and secret shopper results. If the state uses one of these methods to determine compliance, additional fields will be provided to report results by quarter or year. If the results fields provided are not applicable to the state’s compliance findings for this standard, or if the state uses different analyses methods for this standard, you can leave these fields and use the “Plan Deficiencies Description” free text box in the next question to describe the results of the analyses.",
                                    choices: [
                                      {
                                        id: "c595832f837848118f",
                                        label: "Report results by quarter",
                                        children: [
                                          {
                                            id: "quarterlyEnrolleesMeetingStandard",
                                            type: ReportFormFieldType.RADIO,
                                            validation:
                                              ValidationType.RADIO_OPTIONAL,
                                            props: {
                                              choices: [
                                                {
                                                  id: "1Bv4pXDFwPxCtfWnwQ3o4f",
                                                  label:
                                                    "Percent of enrollees that can access this provider type within the standard",
                                                  hint: "Report findings on the percent of plan enrollees that can access this provider type within the defined time or distance.",
                                                  children: [
                                                    {
                                                      id: "q1PercentMetStandard",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.1a - Q1 (optional)",
                                                        mask: "percentage",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q2PercentMetStandard",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.1b - Q2 (optional)",
                                                        mask: "percentage",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q3PercentMetStandard",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.1c - Q3 (optional)",
                                                        mask: "percentage",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q4PercentMetStandard",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.1d - Q4 (optional)",
                                                        mask: "percentage",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                  ],
                                                },
                                                {
                                                  id: "oDBsJxz2uYsFEPJX5tsicD",
                                                  label: "Maximum travel time",
                                                  hint: "Report findings from geomapping on the actual maximum travel time, in minutes, between plan enrollees and network providers.",
                                                  children: [
                                                    {
                                                      id: "q1ActualMaxTime",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.2a - Q1 (optional)",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q2ActualMaxTime",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.2b - Q2 (optional)",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q3ActualMaxTime",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.2c - Q3 (optional)",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q4ActualMaxTime",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.2d - Q4 (optional)",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                  ],
                                                },
                                                {
                                                  id: "ckGB89dyJ9spyFn692tihL",
                                                  label:
                                                    "Maximum travel distance",
                                                  hint: "Report from geomapping on the actual maximum travel distance, in miles, between plan enrollees and network providers.",
                                                  children: [
                                                    {
                                                      id: "q1ActualMaxDist",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.3a - Q1 (optional)",
                                                        mask: "comma-separated",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q2ActualMaxDist",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.3b - Q2 (optional)",
                                                        mask: "comma-separated",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q3ActualMaxDist",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.3c - Q3 (optional)",
                                                        mask: "comma-separated",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q4ActualMaxDist",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.3d - Q4 (optional)",
                                                        mask: "comma-separated",
                                                        decimalPlacesToRoundTo: 0,
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
                                        id: "45PQX2mTtbVrsZtiR2ZFns",
                                        label: "Report results annually",
                                        children: [
                                          {
                                            id: "annualEnrolleesMeetingStandard",
                                            type: ReportFormFieldType.RADIO,
                                            validation:
                                              ValidationType.RADIO_OPTIONAL,
                                            props: {
                                              choices: [
                                                {
                                                  id: "8WCHVPuNhV9cK4nDh1syqX",
                                                  label:
                                                    "Percent of enrollees that can access this provider type within the standard",
                                                  hint: "Report findings on the percent of plan enrollees that can access this provider type within the defined time or distance.",
                                                  children: [
                                                    {
                                                      id: "annualPercentMetStandard",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.1e - Annual (optional)",
                                                        mask: "percentage",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "annualPercentMetStandardDate",
                                                      type: ReportFormFieldType.DATE,
                                                      validation:
                                                        "dateOptional",
                                                      props: {
                                                        label:
                                                          "III.D.1f - Date of analysis of annual snapshot (optional)",
                                                      },
                                                    },
                                                  ],
                                                },
                                                {
                                                  id: "j44DG9RkDA1FwuYN3SM8zA",
                                                  label: "Maximum travel time",
                                                  hint: "Report findings from geomapping on the actual maximum travel time, in minutes, between plan enrollees and network providers.",
                                                  children: [
                                                    {
                                                      id: "annualMaxTime",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.2e - Annual (optional)",
                                                        mask: "comma-separated",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "annualMaxTimeDate",
                                                      type: ReportFormFieldType.DATE,
                                                      validation:
                                                        "dateOptional",
                                                      props: {
                                                        label:
                                                          "III.D.2f - Date of analysis of annual snapshot (optional)",
                                                      },
                                                    },
                                                  ],
                                                },
                                                {
                                                  id: "qJ8FA2U5ri5mfuwe6PCJhP",
                                                  label:
                                                    "Maximum travel distance",
                                                  hint: "Report from geomapping on the actual maximum travel distance, in miles, between plan enrollees and network providers.",
                                                  children: [
                                                    {
                                                      id: "actualMaxDistance",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.3e - Annual (optional)",
                                                        mask: "comma-separated",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "actualMaxDistanceDate",
                                                      type: ReportFormFieldType.DATE,
                                                      validation:
                                                        "dateOptional",
                                                      props: {
                                                        label:
                                                          "III.D.3f - Date of analysis of annual snapshot (optional)",
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
                            {
                              label: "Plan Provider Directory Review",
                              children: [
                                {
                                  id: "ppdrComplianceFrequency",
                                  type: ReportFormFieldType.CHECKBOX,
                                  validation:
                                    ValidationType.CHECKBOX_ONE_OPTIONAL,
                                  props: {
                                    label:
                                      "Frequency of compliance findings (optional)",
                                    hint: "States may report additional details on the results produced from using geomapping, plan provider directory reviews, and secret shopper results. If the state uses one of these methods to determine compliance, additional fields will be provided to report results by quarter or year. If the results fields provided are not applicable to the state’s compliance findings for this standard, or if the state uses different analyses methods for this standard, you can leave these fields and use the “Plan Deficiencies Description” free text box in the next question to describe the results of the analyses.",
                                    choices: [
                                      {
                                        id: "sxC5M4JJz9qNCdNxJgQmJV",
                                        label: "Report results by quarter",
                                        children: [
                                          {
                                            id: "quarterlyEnrolleesMeetingStandard",
                                            type: ReportFormFieldType.RADIO,
                                            validation:
                                              ValidationType.RADIO_OPTIONAL,
                                            props: {
                                              choices: [
                                                {
                                                  id: "gRCpgad2dhXDrmucTw8cnu",
                                                  label:
                                                    "Minimum number of network providers",
                                                  hint: "Report the minimum number of plan network providers.",
                                                  children: [
                                                    {
                                                      id: "q1NumberOfNetworkProviders",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.4a - Q1 (optional)",
                                                        mask: "comma-separated",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q2NumberOfNetworkProviders",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.4b - Q2 (optional)",
                                                        mask: "comma-separated",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q3NumberOfNetworkProviders",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.4c - Q3 (optional)",
                                                        mask: "comma-separated",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q4NumberOfNetworkProviders",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.4d - Q4 (optional)",
                                                        mask: "comma-separated",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                  ],
                                                },
                                                {
                                                  id: "a8kZrrUYcfUrnTM8UuHNmi",
                                                  label:
                                                    "Provider to enrollee ratio",
                                                  hint: "Report the calculated plan provider to enrollee ratio.",
                                                  children: [
                                                    {
                                                      id: "q1ProviderToEnrolleeRatio",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.5a - Q1 (optional)",
                                                        mask: "percentage",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q2ProviderToEnrolleeRatio",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.5b - Q2 (optional)",
                                                        mask: "percentage",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q3ProviderToEnrolleeRatio",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.5c - Q3 (optional)",
                                                        mask: "percentage",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "q4ProviderToEnrolleeRatio",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.5d - Q4 (optional)",
                                                        mask: "percentage",
                                                        decimalPlacesToRoundTo: 0,
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
                                        id: "wz9n6q8nuxdUKnaw7gWUoj",
                                        label: "Report results annually",
                                        children: [
                                          {
                                            id: "annualEnrolleesMeetingStandard",
                                            type: ReportFormFieldType.RADIO,
                                            validation:
                                              ValidationType.RADIO_OPTIONAL,
                                            props: {
                                              choices: [
                                                {
                                                  id: "j4ch2jWhesE7SHQZYQmvJV",
                                                  label:
                                                    "Minimum number of network providers",
                                                  hint: "Report the minimum number of plan network providers.",
                                                  children: [
                                                    {
                                                      id: "annualMinimumNumberOfNetworkProviders",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.4e - Annual (optional)",
                                                        mask: "comma-separated",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "annualMinimumNumberOfNetworkProvidersDate",
                                                      type: ReportFormFieldType.DATE,
                                                      validation:
                                                        "dateOptional",
                                                      props: {
                                                        label:
                                                          "III.D.4f - Date of analysis of annual snapshot (optional)",
                                                      },
                                                    },
                                                  ],
                                                },
                                                {
                                                  id: "dSHQvqgfa7YYoRBvSKkahW",
                                                  label:
                                                    "Provider to enrollee ratio",
                                                  hint: "Report findings on the calculated plan provider to enrollee ratio.",
                                                  children: [
                                                    {
                                                      id: "annualProviderToEnrolleeRatio",
                                                      type: ReportFormFieldType.NUMBER,
                                                      validation:
                                                        ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                                      props: {
                                                        label:
                                                          "III.D.5e - Annual (optional)",
                                                        mask: "percentage",
                                                        decimalPlacesToRoundTo: 0,
                                                      },
                                                    },
                                                    {
                                                      id: "annualProviderToEnrolleeRatioDate",
                                                      type: ReportFormFieldType.DATE,
                                                      validation:
                                                        "dateOptional",
                                                      props: {
                                                        label:
                                                          "III.D.5f - Date of analysis of annual snapshot (optional)",
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
                            {
                              label: "Secret Shopper: Appointment Availability",
                              children: [
                                {
                                  id: "ssaaComplianceFrequency",
                                  type: ReportFormFieldType.CHECKBOX,
                                  validation:
                                    ValidationType.CHECKBOX_ONE_OPTIONAL,
                                  props: {
                                    label:
                                      "Frequency of compliance findings (optional)",
                                    hint: "States may report additional details on the results produced from using geomapping, plan provider directory reviews, and secret shopper results. If the state uses one of these methods to determine compliance, additional fields will be provided to report results by quarter or year. If the results fields provided are not applicable to the state’s compliance findings for this standard, or if the state uses different analyses methods for this standard, you can leave these fields and use the “Plan Deficiencies Description” free text box in the next question to describe the results of the analyses.",
                                    choices: [
                                      {
                                        id: "9QZMDvvbiWrXcjr5Z1zcuV",
                                        label: "Report results by quarter",
                                        hint: "Report findings on the percent of plan providers that met the appointment wait time standard.",
                                        children: [
                                          {
                                            id: "q1Ssaa",
                                            type: ReportFormFieldType.NUMBER,
                                            validation:
                                              ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                            props: {
                                              label: "III.6.5a - Q1 (optional)",
                                              mask: "percentage",
                                              decimalPlacesToRoundTo: 0,
                                            },
                                          },
                                          {
                                            id: "q2Ssaa",
                                            type: ReportFormFieldType.NUMBER,
                                            validation:
                                              ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                            props: {
                                              label: "III.6.5b - Q2 (optional)",
                                              mask: "percentage",
                                              decimalPlacesToRoundTo: 0,
                                            },
                                          },
                                          {
                                            id: "q3Ssaa",
                                            type: ReportFormFieldType.NUMBER,
                                            validation:
                                              ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                            props: {
                                              label: "III.6.5c - Q3 (optional)",
                                              mask: "percentage",
                                              decimalPlacesToRoundTo: 0,
                                            },
                                          },
                                          {
                                            id: "q4Ssaa",
                                            type: ReportFormFieldType.NUMBER,
                                            validation:
                                              ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                            props: {
                                              label: "III.6.5d - Q4 (optional)",
                                              mask: "percentage",
                                              decimalPlacesToRoundTo: 0,
                                            },
                                          },
                                        ],
                                      },
                                      {
                                        id: "hnKktBxFGNr9jB1AgWLPXf",
                                        label: "Report results annually",
                                        hint: "Report findings on the percent of plan providers that met the appointment wait time standard.",
                                        children: [
                                          {
                                            id: "annualSsaa",
                                            type: ReportFormFieldType.NUMBER,
                                            validation:
                                              ValidationType.NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL,
                                            props: {
                                              label:
                                                "III.6.5e - Annual (optional)",
                                              mask: "percentage",
                                              decimalPlacesToRoundTo: 0,
                                            },
                                          },
                                          {
                                            id: "annualDateSsaa",
                                            type: ReportFormFieldType.DATE,
                                            validation:
                                              ValidationType.DATE_OPTIONAL,
                                            props: {
                                              label:
                                                "III.6.5f - Date of analysis of annual snapshot (optional)",
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
                        id: "planCompliance43868_standard-nonComplianceDescription",
                        type: ReportFormFieldType.TEXTAREA,
                        validation: {
                          type: ValidationType.TEXT,
                          nested: true,
                          parentFieldName: "planCompliance43868_standard",
                        },
                        props: {
                          label: "III.C.2b Plan deficiencies: description",
                          hint: "Describe plan deficiencies identified if results were not previously detailed (note that additional fields will appear for entering results if the state uses geomapping, plan provider directory reviews or secret shopper results to uncover standard deficiencies). You can also use this section to provide any additional context on the plan deficiencies or results provided above.",
                        },
                      },
                      {
                        id: "planCompliance43868_standard-nonCompliancePlanToAchieveCompliance",
                        type: ReportFormFieldType.TEXTAREA,
                        validation: {
                          type: ValidationType.TEXT,
                          nested: true,
                          parentFieldName: "planCompliance43868_standard",
                        },
                        props: {
                          label:
                            "III.C.2c Plan deficiencies: description of what the plan will do to achieve compliance with this standard.",
                          hint: "Describe what the plan will do to achieve compliance specific to this standard.",
                        },
                      },
                      {
                        id: "planCompliance43868_standard-nonComplianceMonitoringProgress",
                        type: ReportFormFieldType.TEXTAREA,
                        validation: {
                          type: ValidationType.TEXT,
                          nested: true,
                          parentFieldName: "planCompliance43868_standard",
                        },
                        props: {
                          label:
                            "III.C.2d Plan deficiencies: monitoring progress",
                          hint: "Describe how the state will monitor the plan’s progress with this standard.",
                        },
                      },
                      {
                        id: "planCompliance43868_standard-nonComplianceReassessmentDate",
                        type: ReportFormFieldType.DATE,
                        validation: {
                          type: ValidationType.DATE,
                          nested: true,
                          parentFieldName: "planCompliance43868_standard",
                        },
                        props: {
                          label: "III.C.2e Reassessment for plan deficiencies",
                          hint: "Indicate when the state will reassess the plan’s network to determine whether the plan has remediated those deficiencies with this standard.",
                        },
                      },
                    ],
                  },
                  {
                    id: "qynBP00OCjrE196bwX3n67",
                    label:
                      "III.C.3a Exceptions granted under 42 C.F.R. § 438.68(d)",
                    children: [
                      {
                        id: "planCompliance43868_standard-exceptionsDescription",
                        type: ReportFormFieldType.TEXTAREA,
                        validation: {
                          type: ValidationType.TEXT,
                          nested: true,
                          parentFieldName: "planCompliance43868_standard",
                        },
                        props: {
                          label:
                            "III.C.3b Describe any network adequacy standard exceptions that the state has granted to the plan under 42 C.F.R. § 438.68(d).",
                        },
                      },
                      {
                        id: "planCompliance43868_standard-exceptionsJustification",
                        type: ReportFormFieldType.TEXTAREA,
                        validation: {
                          type: ValidationType.TEXT,
                          nested: true,
                          parentFieldName: "planCompliance43868_standard",
                        },
                        props: {
                          label:
                            "III.C.3c Justification for exceptions granted under 42 C.F.R. § 438.68(d)",
                          hint: "Describe the state’s justification for granting the exception(s).",
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
      {
        parentForm: "planCompliance438206",
        verbiage: {
          accordion: {
            buttonLabel:
              "Review the availability of services requirements at 42 C.F.R. § 438.206",
            text: [
              {
                type: "p",
                content:
                  "The following is an excerpt from the current regulations in effect at 438.206(b)-(c):",
              },
              {
                type: "p",
                children: [
                  {
                    type: "html",
                    content:
                      "(a) <b>Basic rule.</b> Each State must ensure that all services covered under the State plan are available and accessible to enrollees of MCOs, PIHPs, and PAHPs in a timely manner. The State must also ensure that MCO, PIHP and PAHP provider networks for services covered under the contract meet the standards developed by the State in accordance with ",
                  },
                  {
                    type: "externalLink",
                    content: "§ 438.68",
                    props: {
                      href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-B/section-438.68",
                      target: "_blank",
                      "aria-label": "§ 438.68 (link opens in new tab).",
                    },
                  },
                  {
                    type: "html",
                    content: ".",
                  },
                ],
              },
              {
                type: "p",
                content:
                  "(b) <b>Delivery network.</b> The State must ensure, through its contracts, that each MCO, PIHP and PAHP, consistent with the scope of its contracted services, meets the following requirements:",
              },
              {
                type: "ol",
                props: {
                  className: "ordered-list-parentheses",
                },
                children: [
                  {
                    type: "li",
                    content:
                      "Maintains and monitors a network of appropriate providers that is supported by written agreements and is sufficient to provide adequate access to all services covered under the contract for all enrollees, including those with limited English proficiency or physical or mental disabilities.",
                  },
                  {
                    type: "li",
                    content:
                      "Provides female enrollees with direct access to a women’s health specialist within the provider network for covered care necessary to provide women’s routine and preventive health care services. This is in addition to the enrollee’s designated source of primary care if that source is not a women’s health specialist.",
                  },
                  {
                    type: "li",
                    content:
                      "Provides for a second opinion from a network provider, or arranges for the enrollee to obtain one outside the network, at no cost to the enrollee.",
                  },
                  {
                    type: "li",
                    content:
                      "If the provider network is unable to provide necessary services, covered under the contract, to a particular enrollee, the MCO, PIHP, or PAHP must adequately and timely cover these services out of network for the enrollee, for as long as the MCO, PIHP, or PAHP’s provider network is unable to provide them.",
                  },
                  {
                    type: "li",
                    content:
                      "Requires out-of-network providers to coordinate with the MCO, PIHP, or PAHP for payment and ensures the cost to the enrollee is no greater than it would be if the services were furnished within the network.",
                  },
                  {
                    type: "li",
                    children: [
                      {
                        type: "html",
                        content:
                          "Demonstrates that its network providers are credentialed as required by ",
                      },
                      {
                        type: "externalLink",
                        content: "§ 438.214",
                        props: {
                          href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-D/section-438.214",
                          target: "_blank",
                          "aria-label": "§ 438.214 (link opens in new tab).",
                        },
                      },
                      {
                        type: "html",
                        content: ".",
                      },
                    ],
                  },
                  {
                    type: "li",
                    content:
                      "Demonstrates that its network includes sufficient family planning providers to ensure timely access to covered services.",
                  },
                ],
              },
              {
                type: "p",
                content:
                  "(c) <b>Furnishing of services.</b> The State must ensure that each contract with a MCO, PIHP, and PAHP complies with the following requirements.",
              },
              {
                type: "ol",
                props: {
                  className: "indented-list",
                },
                children: [
                  {
                    type: "li",
                    children: [
                      {
                        type: "html",
                        content:
                          "<b>Timely access.</b> Each MCO, PIHP, and PAHP must do the following:",
                      },
                      {
                        type: "ol",
                        props: {
                          className: "marker-normal",
                        },
                        children: [
                          {
                            type: "li",
                            content:
                              "Meet and require its network providers to meet State standards for timely access to care and services, taking into account the urgency of the need for services.",
                          },
                          {
                            type: "li",
                            content:
                              "Ensure that the network providers offer hours of operation that are no less than the hours of operation offered to commercial enrollees or comparable to Medicaid FFS, if the provider serves only Medicaid enrollees.",
                          },
                          {
                            type: "li",
                            content:
                              "Make services included in the contract available 24 hours a day, 7 days a week, when medically necessary.",
                          },
                          {
                            type: "li",
                            content:
                              "Establish mechanisms to ensure compliance by network providers.",
                          },
                          {
                            type: "li",
                            content:
                              "Monitor network providers regularly to determine compliance.",
                          },
                          {
                            type: "li",
                            content:
                              "Take corrective action if there is a failure to comply by a network provider.",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: "li",
                    content:
                      "<b>Access and cultural considerations.</b> Each MCO, PIHP, and PAHP participates in the State’s efforts to promote the delivery of services in a culturally competent manner to all enrollees, including those with limited English proficiency and diverse cultural and ethnic backgrounds, disabilities, and regardless of sex which includes sex characteristics, including intersex traits; pregnancy or related conditions; sexual orientation; gender identity and sex stereotypes.",
                  },
                  {
                    type: "li",
                    content:
                      "<b>Accessibility considerations.</b> Each MCO, PIHP, and PAHP must ensure that network providers provide physical access, reasonable accommodations, and accessible equipment for Medicaid enrollees with physical or mental disabilities.",
                  },
                ],
              },
              {
                type: "p",
                children: [
                  {
                    type: "html",
                    content:
                      "(d) <b>Applicability date.</b> States will not be held out of compliance with the requirements of ",
                  },
                  {
                    type: "externalLink",
                    content: "paragraphs (c)(1)(i)",
                    props: {
                      href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-D/section-438.206#p-438.206s(c)(1)(i)",
                      target: "_blank",
                      "aria-label":
                        "Paragraphs (c)(1)(i) (link opens in new tab).",
                    },
                  },
                  {
                    type: "html",
                    content:
                      "of this section prior to the first rating period that begins on or after 3 years after July 9, 2024, so long as they comply with the corresponding standard(s) codified in ",
                  },
                  {
                    type: "externalLink",
                    content: "42 CFR 438.206(c)(1)(i)",
                    props: {
                      href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-D/section-438.206#p-438.206(c)(1)(i)",
                      target: "_blank",
                      "aria-label":
                        "42 CFR 438.206(c)(1)(i) (link opens in new tab).",
                    },
                  },
                  {
                    type: "html",
                    content: " (effective as of October 1, 2023).",
                  },
                ],
              },
            ],
          },
          backButton:
            "Return to plan compliance data for {{planName}} dashboard",
          intro: {
            hint: "Report on 42 C.F.R. § 438.206 plan compliance during the reporting period.",
            info: [
              {
                type: "p",
                children: [
                  {
                    type: "html",
                    content:
                      "<strong>Plan non-compliance for 42 C.F.R. § 438.206</strong><br>Report on how this plan is not in compliance with 42 C.F.R. § 438.206. Full details are available above; click on the “+” to view. Select all that apply.",
                  },
                ],
              },
            ],
            section: "III. Plan compliance data for {{planName}}",
            subsection:
              "{{planName}}: Provide plan compliance details for 438.206",
          },
        },
        form: {
          id: "planCompliance438206_details",
          fields: [
            {
              groupId: "planCompliance438206_requirements",
              id: "delivery",
              type: ReportFormFieldType.CHECKBOX,
              validation: ValidationType.CHECKBOX,
              props: {
                label: "III.B.2 Delivery network-related requirements:",
                choices: [
                  {
                    id: "lWYfZ8qpdK2vwNXXwy9b1l",
                    label:
                      "Does not maintain and monitor a sufficient network of appropriate providers",
                  },
                  {
                    id: "sLldgKpZzVL6m6EgX2dir0",
                    label:
                      "Does not provide female enrollees with direct access to a women’s health specialist within the provider network",
                  },
                  {
                    id: "Hd8vUiUgEpQ2VW6qPFgr7F",
                    label:
                      "Does not provide for or arrange a no-cost-to-enrollee second opinion from an in-network or outside-network provider",
                  },
                  {
                    id: "gg7I3xv2SfzDNwzF2iZfGJ",
                    label:
                      "Does not adequately and/or timely cover the enrollee’s MCO, PIHP, or PAHP services out of network",
                  },
                  {
                    id: "AYcV5e4k05D7qdIfwdBXZe",
                    label:
                      "Does not require out-of-network providers to coordinate with the MCO, PIHP, or PAHP for payment and ensure the cost to the enrollee is no greater than in-network services",
                  },
                  {
                    id: "lBkMiJbx86pvQebwYTmo8B",
                    label:
                      "Does not demonstrate that its network providers are credentialed as required by § 438.214",
                  },
                  {
                    id: "FnJK7Kc8gGemirYpZi1zyk",
                    label:
                      "Does not demonstrate that its network includes sufficient family planning providers to ensure timely access to covered services",
                  },
                ],
              },
            },
            {
              groupId: "planCompliance438206_requirements",
              id: "timely",
              type: ReportFormFieldType.CHECKBOX,
              validation: ValidationType.CHECKBOX,
              props: {
                label:
                  "III.B.3 Furnishing of services; timely access-related requirements:",
                choices: [
                  {
                    id: "LR9DAx31NetMHZmnGNfP37",
                    label:
                      "Does not meet and require its network providers to meet State standards for timely access to care and services taking into account the urgency of the need for services, as well as appointment wait times specified in § 438.68(e).",
                  },
                  {
                    id: "Tu7OYfKHnP0ZRa99wDeL6i",
                    label:
                      "Does not ensure that the network providers offer hours of operation that are no less than the hours of operation offered to commercial enrollees or comparable to Medicaid FFS",
                  },
                  {
                    id: "3GzgglRDIwc9kBjdaakNzP",
                    label:
                      "Does not make services included in the contract available 24 hours a day, 7 days a week, when medically necessary",
                  },
                  {
                    id: "w9rDCLPhOeyYKpAv0dXnsG",
                    label:
                      "Does not establish mechanisms to ensure compliance by network providers",
                  },
                  {
                    id: "h5ryUU2XKw8JQOM1K5sHgG",
                    label:
                      "Does not monitor network providers regularly to determine compliance",
                  },
                  {
                    id: "i6T9cJB3JdOcwvEBelchNU",
                    label:
                      "Does not make corrective action if there is a failure to comply by a network provider",
                  },
                ],
              },
            },
            {
              groupId: "planCompliance438206_requirements",
              id: "other",
              type: ReportFormFieldType.CHECKBOX,
              validation: ValidationType.CHECKBOX,
              props: {
                label: "III.B.4 Other requirements:",
                choices: [
                  {
                    id: "TlP89DrzdEg5KQ1LXXFCUe",
                    label:
                      "Does not take into account access and cultural considerations",
                  },
                  {
                    id: "ilvC7PazhMXTL6aL7LDRAE",
                    label:
                      "Does not ensure that network providers provide physical access, reasonable accommodations, and accessible equipment",
                  },
                  {
                    id: "mrCzwGVdpvl81r5P0JDTSr",
                    label: "Other, specify",
                    children: [
                      {
                        id: "planCompliance438206_requirements-otherText",
                        type: ReportFormFieldType.TEXTAREA,
                        validation: {
                          type: ValidationType.TEXT,
                          nested: true,
                          parentFieldName: "planCompliance438206_requirements",
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              id: "planCompliance438206_planDeficiencies-description",
              type: ReportFormFieldType.TEXTAREA,
              validation: ValidationType.TEXT,
              props: {
                label:
                  "III.B.5 Plan deficiencies: 42 C.F.R. § 438.206 description",
                hint: "Describe additional plan deficiencies identified during the reporting period.",
              },
            },
            {
              id: "planCompliance438206_planDeficiencies-analyses",
              type: ReportFormFieldType.TEXTAREA,
              validation: ValidationType.TEXT,
              props: {
                label:
                  "III.B.6 Plan deficiencies: 42 C.F.R. § 438.206 analyses used to identify deficiencies",
                hint: "Indicate which analyses uncovered the deficiencies.",
              },
            },
            {
              id: "planCompliance438206_planDeficiencies-compliance",
              type: ReportFormFieldType.TEXTAREA,
              validation: ValidationType.TEXT,
              props: {
                label:
                  "III.B.7 Plan deficiencies: 42 C.F.R. § 438.206 description of what the plan will do to achieve compliance",
                hint: "Describe what the plan will do to achieve compliance.",
              },
            },
            {
              id: "planCompliance438206_planDeficiencies-progress",
              type: ReportFormFieldType.TEXTAREA,
              validation: ValidationType.TEXT,
              props: {
                label:
                  "III.B.8 Plan deficiencies: 42 C.F.R. § 438.206 monitoring progress",
                hint: "Describe how the state will monitor the plan’s progress.",
              },
            },
            {
              id: "planCompliance438206_planDeficiencies-date",
              type: ReportFormFieldType.DATE,
              validation: ValidationType.DATE,
              props: {
                label:
                  "III.B.9 Reassessment for plan deficiencies: 42 C.F.R. § 438.206",
                hint: "Indicate when the state will reassess the plan’s network to determine whether the plan has remediated those deficiencies.",
              },
            },
          ],
        },
      },
    ],
  },
};
