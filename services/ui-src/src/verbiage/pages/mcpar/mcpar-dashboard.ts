export default {
  intro: {
    header: "Managed Care Program Annual Report (MCPAR)",
    body: [
      {
        type: "text",
        content:
          "One MCPAR is required for every managed care program in your state.",
      },
      {
        type: "text",
        as: "span",
        content: "MCPAR is required by 42 CFR § 438.66(e). ",
      },
      {
        type: "externalLink",
        content: "Learn more",
        props: {
          href: "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting/index.html#AMCPR",
          target: "_blank",
        },
      },
    ],
  },
  body: {
    table: {
      caption: "MCPAR Programs",
      headRow: [
        "",
        "Program name",
        "Due date",
        "Last edited",
        "Edited by",
        "Status",
        "",
      ],
    },
    empty:
      "For this report, a managed care program is defined by a set of distinct benefits and eligibility criteria articulated in a contract between states and the state’s managed care plans",
    callToAction: "Add managed care program",
  },
};
