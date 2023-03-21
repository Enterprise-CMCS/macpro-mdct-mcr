export default {
  intro: {
    header: "Before you begin the MCPAR online form",
  },
  body: {
    sections: [
      {
        sectionNumber: 1,
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
        sectionNumber: 2,
        header: "Enter data for each program into the online form",
        body: "The online form sections are organized by state-level, program-level, plan-level indicators. In general, the MCPAR online form matches the organization of the MCPAR Excel workbook. There are some exceptions.",
        img: {
          alt: "Image of side navigation in the application ",
          description: "Preview of the online MCPAR form navigation.",
        },
        spreadsheet: "A_Program_Info",
        additionalInfo:
          "Use these guides to understand which sections match specific tabs in the Excel workbook.",
        tableHeading:
          "Excel workbook tabs are located in these sections in the online form:",
        table: {
          headRow: ["Excel Workbook Tab", "Location in MCPAR online form"],
          bodyRows: [
            ["A_Program_Info", "A: Program information"],
            ["B_State", "B: State-Level Indicators"],
            ["C1_Program_Set", "C: Program-Level Indicators"],
            ["C2_Program_State", "C: Program-Level Indicators"],
            ["D1_Plan_Set", "D: Plan-Level Indicators"],
            ["D2_Plan_Measures", "D: Plan-Level Indicators"],
            ["D3_Plan_Sanctions", "D: Plan-Level Indicators"],
            ["E_BSS_Entities", "E: BSS Entity Indicators"],
          ],
        },
        autosaveHeading: "Saving your work",
        autosaveNotice:
          "Your responses will be saved automatically except for pop-up or sidebar portions of the form, noted with a “Save” button.",
      },
      {
        sectionNumber: 3,
        header: "Submit the MCPAR report to CMS",
        body: "Double check that everything in your MCPAR Report is accurate. You will be able to make edits if necessary and resubmit. Once you are ready, hit Review & Submit.",
        img: {
          alt: "Image of the side navigation with review and submit selected",
        },
      },
    ],
  },
  pageLink: {
    text: "Enter MCPAR online",
    route: "/mcpar",
  },
};
