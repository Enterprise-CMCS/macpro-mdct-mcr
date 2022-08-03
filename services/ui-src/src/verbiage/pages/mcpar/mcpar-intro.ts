import NavigationSectionsImage from "../../../assets/images/NavigationSections_2x.png";
import NavigationSectionsSubmissionImage from "../../../assets/images/NavigationSectionsSubmission_2x.png";

export default {
  intro: {
    header: "Before you begin the MCPAR online form",
  },
  body: {
    sections: [
      {
        header: "Start by adding all Medicaid managed care programs",
        body: "You will need to submit one MCPAR for every managed care program in your state. For this MCPAR report, a managed care program is defined by distinct benefits and eligibility criteria articulated in a contract between states and the state’s managed care plans.",
        widget: {
          title: "Examples of managed care programs:",
          descriptionList: [
            "Health and Recovery Plans (Comprehensive MCO)",
            "Dental Managed Care",
          ],
        },
      },
      {
        header: "Enter data for each program into the online form",
        body: "The online form sections are organized by state-level, program-level, plan-level indicators. In general, the MCPAR online form matches the organization of the MCPAR Excel workbook. There are some exceptions.",
        img: {
          src: NavigationSectionsImage,
          alt: "Image of side navigation in the application ",
          description: "Preview of the online MCPAR form navigation.",
        },
        spreadsheetWidget: {
          iconDescription: "Excel Workbook Icon",
          title: "Find in the Excel Workbook",
          descriptionList: ["A_Program_Info"],
          additionalInfo:
            "Use these guides to understand which sections match specific tabs in the Excel workbook.",
        },
      },
      {
        header: "Submit the MCPAR report to CMS",
        body: "Double check that everything in your MCPAR Report is accurate. You will be able to make edits if necessary and resubmit. Once you are ready, hit Review & Submit.",
        img: {
          src: NavigationSectionsSubmissionImage,
          alt: "Image of the side navigation with review and submit selected",
        },
      },
    ],
  },
  pageLink: {
    text: "Enter MCPAR online",
    route: "mcpar/intro",
  },
};
