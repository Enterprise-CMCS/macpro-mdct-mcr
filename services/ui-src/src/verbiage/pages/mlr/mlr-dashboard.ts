export default {
  intro: {
    header: "Medicaid Medical Loss Ratio (MLR)",
    body: [
      {
        type: "text",
        content:
          'States must provide summary MLR report data at the plan level. The summary reports are based on the plans\' annual MLR reports to state under 42 CFR 438.8(k). If the report is a resubmission, ask your CMS contact to reopen the related report, which will then be "In revision" status.',
      },
      {
        type: "externalLink",
        content: "Learn more",
        props: {
          href: "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting/index.html#MLR",
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
        "Submission name",
        "Last edited",
        "Edited by",
        "Status",
        "",
      ],
    },
    callToAction: "Add new MLR submission",
  },
};
