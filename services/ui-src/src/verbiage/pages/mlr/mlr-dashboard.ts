export default {
  intro: {
    header: "Medicaid Medical Loss Ratio (MLR)",
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
      caption: "MLR Submissions",
      headRow: [
        { hiddenName: "Edit report name" },
        "Submission name",
        "Last edited",
        "Edited by",
        "Status",
        "Submitted",
        "#",
        { hiddenName: "Actions" },
      ],
      sortableHeadRow: {
        edit: { header: "Edit report name", hidden: true, stateUser: true },
        name: { header: "Submission name" },
        lastAltered: { header: "Last edited" },
        editedBy: { header: "Edited by" },
        status: { header: "Status" },
        submissionCount: { header: "#", admin: true },
        actions: { header: "Actions", hidden: true },
        adminRelease: { header: "Release", admin: true, hidden: true },
        adminArchive: { header: "Archive", admin: true, hidden: true },
      },
    },
    empty:
      "States reporting MLRs for multiple managed care programs have the option to create multiple submissions (e.g., one per program) or submit MLR data for multiple programs in one submission.",
    callToAction: "Add new MLR submission",
  },
};
