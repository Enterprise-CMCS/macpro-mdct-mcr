import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const addBssEntitiesRoute: FormRoute = {
  name: "Add BSS Entities",
  path: "/mcpar/program-information/add-bss-entities",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section A: Program Information",
      subsection: "Add BSS entities (A.8)",
      spreadsheet: "A_Program_Info",
      info: [
        {
          type: "p",
          children: [
            {
              type: "html",
              content:
                "Enter the names of Beneficiary Support System (BSS) entities that support enrollees in the program for which the state is reporting data. Learn more about BSS entities at ",
            },
            {
              type: "externalLink",
              content: "42 CFR 438.71",
              props: {
                href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-B/section-438.71",
                target: "_blank",
                "aria-label": "42 CFR 438.71 (link opens in new tab).",
              },
            },
            {
              type: "html",
              content:
                ". See Glossary in Excel Workbook for the definition of BSS entities.",
            },
          ],
        },
        {
          type: "p",
          content:
            "Examples of BSS entity types include a: State or Local Government Entity, Ombudsman Program, State Health Insurance Program (SHIP), Aging and Disability Resource Network (ADRN), Center for Indepedent Living (CIL), Legal Assistance Organization, Community-based Organization, Subcontractor, Enrollment Broker, Consultant, or Academic/Research Organization.",
        },
      ],
    },
  },
  form: {
    id: "absse",
    fields: [
      {
        id: "bssEntities",
        type: ReportFormFieldType.DYNAMIC,
        validation: ValidationType.DYNAMIC,
        props: {
          label: "BSS entity name",
        },
      },
    ],
  },
};
