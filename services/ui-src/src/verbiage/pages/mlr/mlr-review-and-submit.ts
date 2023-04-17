export default {
  print: {
    printPageUrl: "/mcpar/export",
    printButtonText: "Review PDF",
  },
  review: {
    intro: {
      header: "Review & Submit",
      infoHeader: "Ready to Submit?",
      info: "Double check that everything in your MLR Report is accurate. You will be able to make edits after submitting, and resubmit. Once you’ve reviewed your report, certify that it’s in compliance with 42 CFR § 438.66(e).",
    },
    modal: {
      structure: {
        heading: "Are you sure you want to submit MLR?",
        actionButtonText: "Submit MLR",
        closeButtonText: "Cancel",
      },
      body: "You won’t be able to make edits after submitting unless you send a request to CMS to unlock your submission. After compliance review, a CMS representative will contact you if there are corrections to be made and your report status will change to “In revision” in the MLR dashboard.",
    },
    pageLink: {
      text: "Submit MLR",
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
      "Some sections of the MLR report have errors or are missing responses. Please ensure all fields are completed with valid responses before submitting.",
  },
};
