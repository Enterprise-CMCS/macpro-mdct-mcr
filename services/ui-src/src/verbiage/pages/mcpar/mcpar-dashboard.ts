export default {
  returnLink: {
    text: "Return home",
    location: "/",
  },
  intro: {
    eyebrow: "Reporting Year: 2022",
    header: "Managed Care Program Annual Report (MCPAR)",
    body: {
      line1:
        "One MCPAR is required for every managed care program in your state.",
      line2: "MCPAR is required by 42 CFR § 438.66(e). ",
    },
    link: {
      text: "Learn more",
      location:
        "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting/index.html#AMCPR",
    },
  },
  body: {
    table: {
      caption: "MCPAR Programs",
      headRow: ["", "Program Name", "Due Date", "Last Edited", "Edited By", ""],
      empty:
        "For this report, a managed care program is defined by a set of distinct benefits and eligibility criteria articulated in a contract between states and the state’s managed care plans",
    },
    callToAction: "Add managed care program",
  },

  addProgramModal: {
    structure: {
      heading: "Add a Program",
      actionButtonText: "Save",
      closeButtonText: "Close",
    },
    body: "",
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
