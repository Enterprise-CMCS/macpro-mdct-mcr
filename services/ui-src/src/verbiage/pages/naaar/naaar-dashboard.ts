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
              "States must complete one report for each managed care program operating in the state. Medicaid and Medicare managed care plans (MMPs) are not exempt from the requirements at 42 C.F.R. § 438.207, and states must include MMPs in submitted NAAARs as appropriate. To reduce duplication, states can complete network adequacy in sections (II.A.1- II.A.7) for MMPs for Medicaid-only covered services. Reporting on Non-Emergency Medical Transportation (NEMT) PAHPs and Program of All-Inclusive Care for the Elderly (PACE) programs/plans is not required. Reporting on the Children’s Health Insurance Program (CHIP) cannot be submitted in MDCT MCR. Contact ",
          },
          {
            type: "externalLink",
            content: "CHIPManagedCare@cms.hhs.gov",
            props: {
              href: "mailto:CHIPManagedCare@cms.hhs.gov",
              target: "_blank",
              "aria-label": "Mail to CHIPManagedCare@cms.hhs.gov",
            },
          },
          {
            type: "html",
            content: " for more information. ",
          },
          {
            type: "externalLink",
            content: "Learn more about the NAAAR.",
            props: {
              href: "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting#NETWORK",
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
              "States must complete one report for each managed care program operating in the state. Medicaid and Medicare managed care plans (MMPs) are not exempt from the requirements at 42 C.F.R. § 438.207, and states must include MMPs in submitted NAAARs as appropriate. To reduce duplication, states can complete network adequacy in sections (II.A.1- II.A.7) for MMPs for Medicaid-only covered services. Reporting on Non-Emergency Medical Transportation (NEMT) PAHPs and Program of All-Inclusive Care for the Elderly (PACE) programs/plans is not required. Reporting on the Children’s Health Insurance Program (CHIP) cannot be submitted in MDCT MCR. Contact ",
          },
          {
            type: "externalLink",
            content: "CHIPManagedCare@cms.hhs.gov",
            props: {
              href: "mailto:CHIPManagedCare@cms.hhs.gov",
              target: "_blank",
              "aria-label": "Mail to CHIPManagedCare@cms.hhs.gov",
            },
          },
          {
            type: "html",
            content: " for more information. ",
          },
          {
            type: "externalLink",
            content: "Learn more about the NAAAR.",
            props: {
              href: "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting#NETWORK",
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
        "Program name",
        "Plan type",
        "Last edited",
        "Edited by",
        "Status",
        "Initial Submission",
        "#",
        "Actions",
      ],
      sortableHeadRow: {
        name: { header: "Program name" },
        planType: { header: "Plan type" },
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
    callToAction: "Add / copy NAAAR",
  },
};
