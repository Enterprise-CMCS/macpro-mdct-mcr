export default {
  print: {
    printPageUrl: "/mlr/export",
    printButtonText: "Review PDF",
    downloadButtonText: "Download PDF",
  },
  review: {
    intro: {
      header: "Review & Submit",
      infoHeader: "Ready to Submit?",
      info: [
        {
          type: "text",
          as: "span",
          content:
            "Double check that everything in your MLR submission is accurate. You won’t be able to make edits after submitting, unless you send a request to CMS to unlock your report. After compliance review, a CMS representative will contact you if there are corrections to be made and your report status will change to “In revision” in the MLR dashboard. Once you’ve reviewed your report, certify that it’s in compliance with ",
        },
        {
          type: "externalLink",
          content: "42 CFR § 438.74",
          props: {
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-B/section-438.74",
            target: "_blank",
            ariaLabel: "Link opens in new tab",
          },
        },
        {
          type: "text",
          as: "span",
          content: ".",
        },
      ],
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
        "No further action is needed at this point. CMS will contact you with questions or if corrections are needed. Your MLR dashboard will indicate the status of this report as “Submitted”.",
    },
  },
  alertBox: {
    title: "Your form is not ready for submission",
    description:
      "Some sections of the MLR submission have errors or are missing required responses. Please ensure all required fields are completed with valid responses before submitting.",
  },
};
