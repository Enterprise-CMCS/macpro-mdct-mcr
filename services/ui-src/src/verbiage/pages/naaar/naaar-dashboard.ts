export default {
  intro: {
    header: "Network Adequacy and Access Assurances Report (NAAAR)",
    body: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "Complete one (1) report with information for applicable managed care plans and their applicable managed care programs. MMPs are considered both Medicaid and Medicare managed care plans and are not exempt from ",
          },
          {
            type: "externalLink",
            content: "42 CFR 438.207",
            props: {
              href: "https://www.google.com",
              target: "_blank",
              "aria-label": "Link opens in new tab",
            },
          },
          {
            type: "html",
            content:
              ". Therefore, states must submit the tool for integrated plans; however, to reduce duplication, states can complete network adequacy sections of the tool (II.A.1-II.A.5) for Medicaid-only covered services. Reporting on Program of All-Inclusive Care for the Elderly (PACE) programs/plans is not required. ",
          },
          {
            type: "externalLink",
            content: "Learn more about NAAAR.",
            props: {
              href: "https://www.google.com",
              target: "_blank",
              "aria-label": "Learn more (link opens in new tab)",
            },
          },
        ],
      },
    ],
    adminBody: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "States must complete one report for each managed care program operating in the state. Medicaid and Medicare managed care plan MMPs are not exempt from NAAAR requirements at 42 CFR 438.207, and states must submit the tool for these plans. To reduce duplication, states can complete network adequacy sections of the tool (II.A.1-II.A.5) for Medicaid-only covered services. Reporting on Children’s Health Insurance Program (CHIP), Non-Emergency Medical Transportation (NEMT), Program of All-Inclusive Care for the Elderly (PACE) programs/plans is not required. ",
          },
          {
            type: "externalLink",
            content: "Learn more about NAAAR.",
            props: {
              href: "https://www.google.com",
              target: "_blank",
              "aria-label": "Learn more (link opens in new tab)",
            },
          },
        ],
      },
      {
        type: "p",
        content: "CMS Admin Instructions",
        props: {
          style: {
            marginTop: "1.5rem",
            fontWeight: "600",
          },
        },
      },
      {
        type: "ul",
        props: {
          style: {
            paddingLeft: "1rem",
          },
        },
        children: [
          {
            type: "li",
            children: [
              {
                type: "html",
                content:
                  "To allow a state to make corrections or edits to a submission use “Unlock” to release the submission. The status will change to “In revision”.",
              },
            ],
          },
          {
            type: "li",
            children: [
              {
                type: "html",
                content:
                  "Submission count is shown in the # column. Submissions started and submitted once have a count of 1. When a state resubmits a previous submission, the count increases by 1.",
              },
            ],
          },
          {
            type: "li",
            children: [
              {
                type: "html",
                content:
                  "To archive a submission and hide it from a state’s dashboard, use “Archive”.",
              },
            ],
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
      sortableHeadRow: {
        edit: {
          header: "Edit report name and details",
          hidden: true,
          stateUser: true,
        },
        name: { header: "Program name" },
        planType: { header: "Plan type" },
        dueDate: { header: "Due date" },
        lastAltered: { header: "Last edited" },
        editedBy: { header: "Edited by" },
        status: { header: "Status" },
        actions: { header: "Actions", hidden: true },
        adminRelease: { header: "Release", admin: true, hidden: true },
        adminArchive: { header: "Archive", admin: true, hidden: true },
      },
    },
    empty:
      "For this report, a managed care program is defined by a set of distinct benefits and eligibility criteria articulated in a contract between states and the state’s managed care plans.",
    callToAction: "Add / copy managed care program",
  },
};
