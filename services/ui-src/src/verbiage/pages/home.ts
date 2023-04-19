export default {
  intro: {
    header: "Online Managed Care Reporting Portal",
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
        text: "Due dates vary based on contract year of the managed care program and contract period for the first report.",
        table: {
          caption: "MCPAR Due Dates by Contract Year",
          headRow: ["Contract Year", "Contract Period", "Due Date"],
          bodyRows: [
            ["Jul to Jun", "7/1/21 to 6/30/22", "Dec 27, 2022"],
            ["Sep to Aug", "9/1/21 to 8/31/22", "Feb 27, 2023"],
            ["Oct to Sep", "10/1/21 to 9/30/22", "Mar 29, 2023"],
            ["Jan to Dec", "1/1/22 to 12/31/22", "Jun 29, 2023"],
            ["Feb to Jan", "2/1/22 to 1/31/23", "Jul 30, 2023"],
            ["Apr to Mar", "4/1/22 to 3/31/23", "Sep 27, 2023"],
          ],
        },
      },
    },
    MLR: {
      title: "Medical Loss Ratio (MLR) Report",
      body: {
        available:
          "The MLR online form is now available. All states submitting annual base rate certifications on or after October 1, 2022 are required to use the online form to submit their summary MLR reports. The MLR online form should be completed when the annual base rate certification is submitted. The Excel Workbook is available as a reference to collect responses for the online form, and is not required.",

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
        unavailable:
          "The requirement for states to submit this information to CMS began with all contracts with rating periods beginning on or after July 1, 2018. However, prior to June 2022, there had been no requirement to use a standard reporting template. The Excel template is available for states to use immediately if they choose. However, all states submitting rate certification packages on or after October 1, 2022 are required to use the template. Further, CMS recommends that the report be submitted as supporting documentation at the same time a state submits the associated managed care contract to CMS for approval, including a new contract, a renewal, or an amendment.",
      },
      downloadText: "Download NAAAR Template",
      accordion: {
        buttonLabel: "When is the NAAAR due?",
        text: "The information is required to be submitted:",
        list: [
          "At the time the state enters into a contract with each MCO, PIHP, or PAHP;",
          "On an annual basis; and",
          "Any time there is a significant change in the operations that would affect the adequacy of capacity and services of an MCO, PIHP, or PAHP.",
          "CMS recommends that the report be submitted at the same time a state submits the associated managed care contract to CMS for approval, including a new contract, a renewal, or an amendment.",
        ],
      },
    },
  },
  readOnly: {
    header: "View State Reports",
    buttonLabel: "Go to Report Dashboard",
  },
};
