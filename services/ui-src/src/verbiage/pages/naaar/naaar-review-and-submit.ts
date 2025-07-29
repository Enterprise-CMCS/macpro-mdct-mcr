export default {
  print: {
    printPageUrl: "/naaar/export",
    printButtonText: "Review PDF",
    downloadButtonText: "Download PDF",
  },
  review: {
    intro: {
      header: "Review & Submit",
      infoHeader: "Ready to Submit?",
      info: "Double check that everything in your NAAAR report is accurate. You won't be able to make edits after submitting, unless you send a request to CMS to unlock your report. Once you’ve reviewed your report, certify that it’s in compliance with CFRs.",
    },
    table: {
      caption: "Review & Submit",
      headRow: ["Section", "Status", { hiddenName: "Actions" }],
    },
    modal: {
      structure: {
        heading: "Are you sure you want to submit NAAAR?",
        actionButtonText: "Submit NAAAR",
        closeButtonText: "Cancel",
      },
      body: "You won't be able to make edits after submitting, unless you send a request to CMS to unlock your report.",
    },
    pageLink: {
      text: "Submit NAAAR",
    },
  },
  submitted: {
    intro: {
      header: "Successfully Submitted",
      infoHeader: "Thank you",
      additionalInfoHeader: "What happens now?",
      additionalInfo:
        "No further action is needed at this point. CMS will reach out if they have any questions.",
    },
  },
  alertBox: {
    title: "Your form is not ready for submission",
    description:
      "Some sections of the NAAAR report have errors or are missing responses. Please ensure all fields are completed with valid responses before submitting.",
  },
};
