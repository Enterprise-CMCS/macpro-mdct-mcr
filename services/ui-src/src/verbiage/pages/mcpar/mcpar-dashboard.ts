export default {
  intro: {
    header: "Managed Care Program Annual Report (MCPAR)",
    body: [
      {
        type: "p",
        content:
          "One MCPAR is required for every managed care program in your state.",
      },
      {
        type: "p",
        children: [
          {
            type: "html",
            content: "MCPAR is required by 42 CFR § 438.66(e). ",
          },
          {
            type: "externalLink",
            content: "Learn more",
            props: {
              href: "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting/index.html#AMCPR",
              target: "_blank",
              "aria-label": "Learn more (link opens in new tab)",
            },
          },
        ],
      },
    ],
  },
  body: {
    table: {
      caption: "MCPAR Programs",
      headRow: [
        { hiddenName: "Edit report name and details" },
        "Program name",
        "Due date",
        "Last edited",
        "Edited by",
        "Status",
        "#",
        { hiddenName: "Actions" },
      ],
    },
    empty:
      "For this report, a managed care program is defined by a set of distinct benefits and eligibility criteria articulated in a contract between states and the state’s managed care plans",
    callToAction: "Add / copy a MCPAR",
  },
};
