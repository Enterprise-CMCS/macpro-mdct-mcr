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
      info: [
        {
          type: "p",
          children: [
            {
              type: "html",
              content:
                "Double check that everything in your MCPAR Report is accurate. You won't be able to make edits after submitting, unless you send a request to CMS to unlock your report. After compliance review, a CMS representative will contact you if there are corrections to be made and your report status will change to “In revision” in the MCPAR dashboard. Once you’ve reviewed your report, certify that it’s in compliance with ",
            },
            {
              type: "externalLink",
              content: "42 CFR § 438.66(e)",
              props: {
                href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-B/section-438.66#p-438.66(e)",
                target: "_blank",
                "aria-label": "Learn more (link opens in new tab)",
              },
            },
            {
              type: "html",
              content: ".",
            },
          ],
        },
      ],
    },
    table: {
      headRow: ["Section", "Status", { hiddenName: "Actions" }],
    },
    modal: {
      structure: {
        heading: "Are you sure you want to submit MCPAR?",
        actionButtonText: "Submit MCPAR",
        closeButtonText: "Cancel",
      },
      body: "You won’t be able to make edits after submitting unless you send a request to CMS to unlock your submission. After compliance review, a CMS representative will contact you if there are corrections to be made and your report status will change to “In revision” in the MCPAR dashboard.",
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
        "No further action is needed at this point. CMS will contact you with questions or if corrections are needed. Your MCPAR dashboard will indicate the status of this report as “Submitted”.",
    },
  },
  alertBox: {
    title: "Your form is not ready for submission",
    description:
      "Some sections of the MCPAR report have errors or are missing responses. Please ensure all fields are completed with valid responses before submitting.",
  },
};
