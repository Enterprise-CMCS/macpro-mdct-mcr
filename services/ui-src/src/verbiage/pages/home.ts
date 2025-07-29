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
                content: "To view MCPAR due dates, navigate to the ",
              },
              {
                type: "externalLink",
                content:
                  "Due Dates section beneath Managed Care Program Annual Report (MCPAR)",
                props: {
                  rel: "noopener noreferrer",
                  href: "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting#AMCPR",
                  target: "_blank",
                },
              },
              {
                type: "html",
                content:
                  ". Note, due dates vary based on contract year of the managed care program and contract period for the first report.",
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
          "The requirement for states to submit this information to CMS began for all contracts with rating periods starting on or after July 1, 2018. In June 2022, CMS published a standard reporting template in Excel. Beginning July 30, 2025, states will be able to submit the NAAAR using the MDCT MCR web portal. The Excel template has been updated to correspond with the webform and will continue to be accepted for official reporting. However, for all rating periods starting on or after July 9, 2025, states will be required to complete the NAAAR in MDCT MCR.",
        unavailable:
          "The requirement for states to submit this information to CMS began for all contracts with rating periods starting on or after July 1, 2018. In June 2022, CMS published a standard reporting template in Excel. Beginning July 30, 2025, states will be able to submit the NAAAR using the MDCT MCR web portal. The Excel template has been updated to correspond with the webform and will continue to be accepted for official reporting. However, for all rating periods starting on or after July 9, 2025, states will be required to complete the NAAAR in MDCT MCR.",
      },
      downloadText: "Download NAAAR Template",
      link: {
        text: "Enter NAAAR online",
        route: "naaar/",
      },
      accordion: {
        buttonLabel: "When must states submit the NAAAR to CMS?",
        text: "The information required at 42 CFR § 438.207(d)(3) must be submitted to CMS under 3 scenarios:",
        orderedList: [
          "When a state enters into a contract with each MCO, PIHP, or PAHP, NAAAR reports must be submitted sufficiently in advance to enable CMS to make a determination that the contract entered into as specified at § 438.207(c)(1) is approved under § 438.3(a);",
          "On an annual basis and no later than 180 calendar days after each rating period;",
          "When there is a significant change, as defined by the state, in the operations that would affect the adequacy of capacity and services of an MCO, PIHP, or PAHP and with the submission of the associated contract, including a new contract, a renewal, or an amendment, as required at § 438.3(a).",
        ],
      },
    },
  },
  readOnly: {
    header: "View State/Territory Reports",
    buttonLabel: "Go to Report Dashboard",
  },
};
