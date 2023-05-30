export default {
  print: {
    printPageUrl: "/mcpar/export",
    printButtonText: "Review PDF",
    downloadButtonText: "Download PDF",
  },
  review: {
    intro: {
      header: "Review & Submit",
      infoHeader: "Ready to Submit?",
      info: "Double check that everything in your MCPAR Report is accurate. You will be able to make edits after submitting, and resubmit. Once you’ve reviewed your report, certify that it’s in compliance with 42 CFR § 438.66(e).",
    },
    table: {
      headRow: ["Section", "Status", ""],
    },
    modal: {
      structure: {
        heading: "Are you sure you want to submit MCPAR?",
        actionButtonText: "Submit MCPAR",
        closeButtonText: "Cancel",
      },
      body: "You will be able to make edits to this MCPAR after submitting, and resubmit.",
    },
    pageLink: {
      text: "Submit MCPAR",
    },
  },
  submitted: {
    intro: {
      header: "Successfully Submitted",
      infoHeader: "Thank you",
      additionalInfoHeader: "What happens now?",
      additionalInfo:
        "No further action is needed at this point. CMS will reach out if in the case they have any questions.",
    },
  },
  alertBox: {
    title: "Your form is not ready for submission",
    description:
      "Some sections of the MCPAR report have errors or are missing responses. Please ensure all fields are completed with valid responses before submitting.",
  },
};
