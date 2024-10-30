export default {
  intro: {
    header: "Network Adequacy and Access Assurances Report (NAAAR)",
    body: [
      {
        type: "text",
        content:
          "Complete one (1) report with information for applicable managed care plans and their applicable managed care programs. MMPs are considered both Medicaid and Medicare managed care plans and are not exempt from 42 CFR 438.207. Therefore, states must submit the tool for integrated plans; however, to reduce duplication, states can complete network adequacy sections of the tool (II.A.1-II.A.5) for Medicaid-only covered services. Reporting on Program of All-Inclusive Care for the Elderly (PACE) programs/plans is not required.",
      },
      {
        type: "externalLink",
        content: "Learn more about NAAAR.",
        props: {
          href: "",
          target: "_blank",
          "aria-label": "Learn more (link opens in new tab)",
        },
      },
    ],
  },
  body: {
    table: {
      caption: "NAAAR Submissions",
      headRow: [
        { hiddenName: "Edit report name and details" },
        "Program name",
        "Plan type",
        "Due date",
        "Last edited",
        "Edited by",
        "Status",
        { hiddenName: "Actions" },
      ],
    },
    empty:
      "For this report, a managed care program is defined by a set of distinct benefits and eligibility criteria articulated in a contract between states and the state’s managed care plans.",
    callToAction: "Add / copy managed care program",
  },
};
