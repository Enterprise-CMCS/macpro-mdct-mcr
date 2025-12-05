export default {
  MCPAR: {
    formIntro: {
      buttonLabel: "Instructions",
      intro: [
        {
          type: "p",
          children: [
            {
              type: "html",
              content: "<b>Background</b>",
            },
          ],
        },
        {
          type: "p",
          content:
            "This report collects information about your program and an assessment of how it operates. This should include how an MCO, PIHP, or PAHP performs on quality measures, including consumer report cards and surveys. 42 CFR 438.66(e)(2)(vii).",
        },
        {
          type: "p",
          children: [
            {
              type: "html",
              content: "<b>Instructions</b>",
            },
          ],
        },
        {
          type: "p",
          children: [
            {
              type: "html",
              content:
                "Starting December 2026, CMS will require states to report this data per calendar year. Moving all states, programs, and plans onto the same reporting timeframe will help standardize data, make it easier to compare, and align it with other CMS systems. To determine which calendar year to use for your report, reference the: ",
            },
            {
              type: "externalLink",
              content:
                "MCPAR Technical Guidance: Quality Measures (TG), found here on Medicaid.gov.",
              props: {
                href: "https://www.medicaid.gob",
                target: "_blank",
                "aria-label":
                  "MCPAR Quality Measures Technical Guidance (link opens in new tab)",
              },
            },
          ],
        },
        {
          type: "p",
          children: [
            {
              type: "html",
              content: "<b>Reporting scope</b>",
            },
          ],
        },
        {
          type: "p",
          content:
            "Include the measures that the state uses to evaluate plan performance. This may include, but is not limited to:",
        },
        {
          type: "ol",
          children: [
            {
              type: "li",
              content: "Plan measures from External Quality Review activities",
            },
            {
              type: "li",
              content: "Contract-required quality of care measures",
            },
            {
              type: "li",
              content:
                "Plan measures used for pay-for-performance and evaluation (e.g., state directed payment, ILOS, plan incentives and withholds)",
            },
            {
              type: "li",
              content: "Measures that states calculate on behalf of plans",
            },
          ],
        },
        {
          type: "p",
          content:
            "Where a measure steward asks only for the total rate, report the total rate. If a measure steward specifies multiple rates for the same measure (e.g., rates for different age groups, etc.) follow the decision tree located in Figure X in the technical guidance to determine which rates to report. The state should not report all possible rates for the measure in the MCPAR.",
        },
        {
          type: "p",
          content:
            "Always keep children separate from adults unless the measure specifies otherwise. Refer to the technical guidance for more information and examples.",
        },
      ],
      text: "",
    },
  },
  MLR: {
    adminDashboard: {
      buttonLabel: "Instructions",
      intro: [
        {
          type: "p",
          content: "<b>State User Instructions</b>",
        },
        {
          type: "p",
          children: [
            {
              type: "html",
              content: "As described at ",
            },
            {
              type: "externalLink",
              content: "42 CFR § 438.74",
              props: {
                href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-B/section-438.74",
                target: "_blank",
                "aria-label": "42 CFR § 438.74 (link opens in new tab)",
              },
            },
            {
              type: "html",
              content:
                ", states are required to report summary Medical Loss Ratio (MLR) reports to the Centers for Medicare & Medicaid Services (CMS). The summary MLR report submission coincides with the state’s submission of the annual base rate certification. The summary reports are based on the plans’ annual MLR reports to the state required under ",
            },
            {
              type: "externalLink",
              content: "42 CFR § 438.8(k)",
              props: {
                href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)",
                target: "_blank",
                "aria-label": "42 CFR § 438.8(k) (link opens in new tab)",
              },
            },
            {
              type: "html",
              content:
                ". If the state needs to revise MLR reports previously submitted using the online form, ask your CMS contact to reopen the related submission, which will change it to an “In revision” status. If the state needs to revise MLR reports previously submitted using the Excel Workbook or other format, reach out to your CMS contact to discuss next steps. ",
            },
            {
              type: "externalLink",
              content: "Learn more about the Medical Loss Ratio report",
              props: {
                href: "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting/index.html#MLR",
                target: "_blank",
                "aria-label":
                  "Learn more about the Medical Loss Ratio report (link opens in new tab)",
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
          content: "<b>CMS Admin Instructions</b>",
        },
      ],
      list: [
        "To allow a state to make corrections or edits to a submission use “Unlock” to release the submission. The status will change to “In revision”.",
        "Submission count is shown in the # column. Submissions started and submitted once have a count of 1. When a state resubmits a previous submission, the count increases by 1.",
        "To archive a submission and hide it from a state's dashboard, use “Archive”.",
      ],
      text: "",
    },
    stateUserDashboard: {
      buttonLabel: "Instructions",
      intro: [
        {
          type: "p",
          children: [
            {
              type: "html",
              content: "As described at ",
            },
            {
              type: "externalLink",
              content: "42 CFR § 438.74",
              props: {
                href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-B/section-438.74",
                target: "_blank",
                "aria-label": "42 CFR § 438.74 (link opens in new tab)",
              },
            },
            {
              type: "html",
              content:
                ", states are required to report summary Medical Loss Ratio (MLR) reports to the Centers for Medicare & Medicaid Services (CMS). The summary MLR report submission coincides with the state’s submission of the annual base rate certification. The summary reports are based on the plans’ annual MLR reports to the state required under ",
            },
            {
              type: "externalLink",
              content: "42 CFR § 438.8(k)",
              props: {
                href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)",
                target: "_blank",
                "aria-label": "42 CFR § 438.8(k) (link opens in new tab)",
              },
            },
            {
              type: "html",
              content:
                ". If the state needs to revise MLR reports previously submitted using the online form, ask your CMS contact to reopen the related submission, which will change it to an “In revision” status. If the state needs to revise MLR reports previously submitted using the Excel Workbook or other format, reach out to your CMS contact to discuss next steps. ",
            },
            {
              type: "externalLink",
              content: "Learn more about the Medical Loss Ratio report",
              props: {
                href: "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting/index.html#MLR",
                target: "_blank",
                "aria-label":
                  "Learn more about the Medical Loss Ratio report (link opens in new tab)",
              },
            },
            {
              type: "html",
              content: ".",
            },
          ],
        },
      ],
      list: [],
      text: "",
    },
    formIntro: {
      buttonLabel: "Instructions",
      intro: [
        {
          type: "p",
          children: [
            {
              type: "html",
              content:
                "States must provide summary MLR report data for each managed care plan. These reports are based on the plans' annual MLR reports to the state under ",
            },
            {
              type: "externalLink",
              content: "42 CFR § 438.8(k)",
              props: {
                href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)",
                target: "_blank",
                "aria-label": "42 CFR § 438.8(k) (link opens in new tab)",
              },
            },
            {
              type: "html",
              content:
                ". States have the option of reporting these data for each managed care program, statewide, or at another level of aggregation (e.g., eligibility groups). Managed care program is defined by a specified set of benefits and eligibility criteria that are articulated in a contract between the state and managed care plans. <b>In general, MLR data should not be aggregated across programs; however, if a managed care plan participates in more than one program with the state—the state can report the plan's MLRs for each program separately or combine the plan's results across managed care programs.</b> If a state combines the plan's reporting across programs, the report must use a consistent MLR reporting year.",
            },
          ],
        },
        {
          type: "p",
          children: [
            {
              type: "html",
              content:
                "States must report MLRs for both credible and non-credible MCOs, PIHPs, and PAHPs. There is no exception for MLR reporting for non-credible managed care plans. Under ",
            },
            {
              type: "externalLink",
              content: "42 CFR § 438.8(l)",
              props: {
                href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(l)",
                target: "_blank",
                "aria-label": "42 CFR § 438.8(l) (link opens in new tab)",
              },
            },
            {
              type: "html",
              content:
                " a state may exclude a plan that is newly contracted with the state from this reporting for the first year of the plan's operation. These “new experience” plans must report MLRs during the next MLR reporting year in which the plan is in business with the state, even if the first year was not a full 12 months.",
            },
          ],
        },
      ],
      list: [],
      text: "",
    },
    detailIntro: {
      buttonLabel: "Instructions",
      intro: [
        {
          type: "p",
          content:
            "States must report the five required MLR summary elements. Note that the form fields do not automatically calculate the MLR numerator, denominator, or MLR percentage. Each element must be entered manually. Fields marked as “optional” are included to allow states to report additional MLR data that states currently collect from MCOs, PIHPs, or PAHPs.",
        },
        {
          type: "p",
          children: [
            {
              type: "html",
              content:
                "Note: States that are reporting non-credible plans should enter member month values in section 3.1 as described below. States should report all other required MLR reporting elements (sections 1.3, 2.3, 3.4) with the value 0, and answer “No” for section 4.1 when reporting non-credible plan information. Reporting in this way will ensure that the progress indicators result in a “complete” status. Information on non-credible plans and credibility adjustment calculations is available from ",
            },
            {
              type: "externalLink",
              content: "CMCS Informational Bulletin dated July 31, 2017",
              props: {
                href: "https://www.medicaid.gov/federal-policy-guidance/downloads/cib073117.pdf",
                target: "_blank",
                "aria-label":
                  "CMCS Informational Bulletin dated July 31, 2017 (link opens in new tab)",
              },
            },
            {
              type: "html",
              content: ".",
            },
          ],
        },
      ],
      list: [],
      text: "",
    },
  },
};
