export default {
  intro: {
    header: "Network Adequacy and Access Assurances Report (NAAAR)",
    body: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content: "",
          },
          {
            type: "externalLink",
            content: "",
            props: {},
          },
        ],
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
