export default {
  missingEntry: {
    noResponse: "Not answered",
    noResponseOptional: "Not answered",
    notApplicable: "Not applicable",
    missingPlans:
      "This program is missing plans. You won't be able to complete this section until you've added all the managed care plans that serve enrollees in the program. Go to section A: Add Plans.",
  },
  reportBanner: {
    intro: "Click below to export or print MCPAR shown here",
    pdfButton: "Download PDF",
  },
  metadata: {
    author: "CMS",
    subject: "Managed Care Program Annual Report",
    language: "English",
  },
  reportPage: {
    heading: "Managed Care Program Annual Report (MCPAR) for ",
    metadataTableHeaders: {
      dueDate: "Due date",
      lastEdited: "Last edited",
      editedBy: "Edited by",
      status: "Status",
    },
    combinedDataTable: {
      title: "Exclusion of CHIP from MCPAR",
      subtitle:
        "Enrollees in separate CHIP programs funded under Title XXI should not be reported in the MCPAR. Please check this box if the state is unable to remove information about Separate CHIP enrollees from its reporting on this program.",
    },
    naaarSubmissionTable: {
      title:
        "Did you submit or do you plan on submitting a Network Adequacy and Access Assurances (NAAAR) Report for this program for this reporting period through the MDCT online tool?",
      subtitle:
        "If “No”,  please complete the following questions under each plan.",
    },
  },
  tableHeaders: {
    number: "Number",
    indicator: "Indicator",
    response: "Response",
  },
  modalOverlayTableHeaders: {},
  emptyEntityMessage: {
    accessMeasures: "0  - No access measures entered",
    sanctions: "0 - No sanctions entered",
    qualityMeasures: "0 - No quality & performance measures entered",
  },
};
