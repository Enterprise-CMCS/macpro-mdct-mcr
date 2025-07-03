export default {
  intro: {
    header: "Managed Care Reporting Portal",
    body: {
      preLinkText:
        "Get started by adding all the Medicaid managed care programs for your state. Learn more about this ",
      linkText: "new data collection tool",
      linkLocation:
        "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting/index.html",
      postLinkText: " from CMS.",
    },
  },
  cards: {
    MCPAR: {
      title: "Managed Care Program Annual Report (MCPAR)",
      body: {
        available:
          "The MCPAR online form is now available. Note: Every state must submit one report per program, through the online form.",
      },
      downloadText: "Download MCPAR Excel Workbook",
      link: {
        text: "Enter MCPAR online",
        route: "mcpar/get-started",
      },
      accordion: {
        buttonLabel: "When is the MCPAR due?",
        text: [
          {
            type: "p",
            children: [
              {
                type: "html",
                content: "To view MCPAR due dates select ",
              },
              {
                type: "externalLink",
                content: "this link",
                props: {
                  href: "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting#AMCPR",
                  target: "_blank",
                  "aria-label": "MCPAR due dates (link opens in new tab)",
                },
              },
              {
                type: "html",
                content:
                  " and navigate to the Due Dates sections beneath Managed Care Program Annual Report (MCPAR). Note, due dates vary based on contract year of the managed care program and contract period for the first report.",
              },
            ],
          },
        ],
      },
    },
    MLR: {
      title: "Medical Loss Ratio (MLR) Report",
      body: {
        available:
          "The MLR online form is now available for states to submit MLR reports to CMS when their annual base rate certifications are submitted. The Excel-based MLR reporting template is available as a reference to collect information for the online form, and does not need to be separately submitted to CMS.",

        unavailable:
          "The requirement for states to submit this information to CMS began for rating periods starting on or after July 1, 2017. However, prior to June 2022, there had been no requirement to use a standard reporting template. The Excel template is available for states to use immediately if they choose. However, all states submitting rate certification packages on or after October 1, 2022 are required to use the template. Further, it should be submitted as additional documentation when the annual rate certification is submitted.",
      },
      downloadText: "Download MLR Excel Reference",
      link: {
        text: "Enter MLR online",
        route: "mlr/",
      },
      accordion: {
        buttonLabel: "When is the MLR due?",
        text: "This report must be submitted at the same time the annual base rate certification is submitted.",
      },
    },
    NAAAR: {
      title: "Network Adequacy and Access Assurances Report (NAAAR)",
      body: {
        available:
          "The requirement for states to submit this information to CMS began with all contracts with rating periods beginning on or after July 1, 2018. In June 2022, CMS published a standard reporting template in Excel. Beginning on or after August 2025, all states submitting NAAAR reports under any circumstance will be required to submit a report using this MDCT MCR web portal and can no longer submit the NAAAR using the Excel spreadsheet.",
        unavailable:
          "The requirement for states to submit this information to CMS began with all contracts with rating periods beginning on or after July 1, 2018. In June 2022, CMS published a standard reporting template in Excel. Beginning on or after August 2025, all states submitting NAAAR reports under any circumstance will be required to submit a report using this MDCT MCR web portal and can no longer submit the NAAAR using the Excel spreadsheet.",
      },
      downloadText: "Download NAAAR Template",
      link: {
        text: "Enter NAAAR online",
        route: "naaar/",
      },
      accordion: {
        buttonLabel: "When must states submit the NAAAR to CMS?",
        introText:
          "The information required at 42 CFR § 438.207(d)(3) must be submitted to CMS under 3 scenarios:",
        orderedList: [
          "When a state enters into a contract with each MCO, PIHP, or PAHP, NAAAR reports must be submitted sufficiently in advance to enable CMS to make a determination that the contract entered into as specified at § 438.207(c)(1) is approved under § 438.3(a);",
          "On an annual basis and no later than 180 calendar days after each rating period;",
          "When there is a significant change, as defined by the state, in the operations that would affect the adequacy of capacity and services of an MCO, PIHP, or PAHP and with the submission of the associated contract, including a new contract, a renewal, or an amendment, as required at § 438.3(a).",
        ],
        followUpText:
          "Additional guidance on timing of submissions for rating periods beginning on or after July 9, 2025: Under scenario #1, states will be required to submit the report sufficiently in advance to enable CMS to make a determination that the new plan contract is approved under § 438.3(a). Under scenario #2, the timing of annual submissions will align with the Managed Care Program Annual Report, MCPAR, i.e. states must submit the report on an annual basis and no later than 180 calendar days after each rating period. Under scenario #3, states will be required to submit the report with the associated contract, including a new contract, a renewal, or an amendment, as required at § 438.3(a).",
      },
    },
  },
  readOnly: {
    header: "View State/Territory Reports",
    buttonLabel: "Go to Report Dashboard",
  },
};
