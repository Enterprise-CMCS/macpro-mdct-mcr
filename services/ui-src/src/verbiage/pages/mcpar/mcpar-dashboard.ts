export default {
  returnLink: {
    text: "Return home",
    location: "/",
  },
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
      headRow: ["", "Program Name", "Due Date", "Last Edited", "Edited By", ""],
    },
    editReportButtonText: {
      created: "Start report",
      inProgress: "Edit",
      submitted: "Submitted",
    },
    empty:
      "For this report, a managed care program is defined by a set of distinct benefits and eligibility criteria articulated in a contract between states and the state’s managed care plans",
    callToAction: "Add managed care program",
  },
  addProgramModal: {
    structure: {
      heading: "Add a Program",
      actionButtonText: "Save",
      closeButtonText: "Close",
    },
  },
  deleteProgramModal: {
    structure: {
      heading: "Delete",
      actionButtonText: "Yes, delete program",
      closeButtonText: "Cancel",
    },
    body: "You will lose all information entered for this program. Are you sure you want to proceed?",
  },
};
