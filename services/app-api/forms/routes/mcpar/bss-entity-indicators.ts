import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../utils/types";

export const bssEntityIndicatorsRoute: DrawerFormRoute = {
  name: "E: BSS Entity Indicators",
  path: "/mcpar/bss-entity-indicators",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.BSS_ENTITIES,
  verbiage: {
    intro: {
      section: "Section E: BSS Entity Indicators",
      subsection: "Topic IX. Beneficiary Support System (BSS) Entities",
      spreadsheet: "E_BSS_Entities",
      info: [
        {
          type: "p",
          children: [
            {
              type: "html",
              content:
                "Per 42 CFR 438.66(e)(2)(ix), the Managed Care Program Annual Report must provide information on and an assessment of the operation of the managed care program including activities and performance of the beneficiary support system. Information on how BSS entities support program-level functions is on the ",
            },
            {
              type: "internalLink",
              content: "Program-Level BSS",
              props: {
                to: "/mcpar/program-information/add-bss-entities",
              },
            },
            {
              type: "html",
              content: " page.",
            },
          ],
        },
      ],
    },
    dashboardTitle: "Report on role and type for each BSS entity",
    drawerTitle: "Report on {{name}}",
    missingEntityMessage: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "This program is missing BSS entities. You won’t be able to complete this section until you’ve added all the names of BSS entities that support enrollees in the program. ",
          },
          {
            type: "internalLink",
            content: "Add BSS entities",
            props: {
              to: "/mcpar/program-information/add-bss-entities",
            },
          },
        ],
      },
    ],
  },
  drawerForm: {
    id: "ebssei",
    fields: [
      {
        id: "bssEntity_entityType",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "E.IX.1 BSS entity type",
          hint: "What type of entity performed each BSS activity? Check all that apply. Refer to 42 CFR 438.71(b).",
          choices: [
            {
              id: "b8RT4wLcoU2yb0QgswyAfQ",
              label: "State Government Entity",
            },
            {
              id: "n8Nje9xGS0SXCymALzc42g",
              label: "Local Government Entity",
            },
            {
              id: "iDWw3TwoI0iHbO1V7XO1Nw",
              label: "Ombudsman Program",
            },
            {
              id: "0l4OWGZg7keJKdoRr3rNNA",
              label: "State Health Insurance Assistance Program (SHIP)",
            },
            {
              id: "9KfSY0XoS0Kn4AVEQWqYZw",
              label: "Aging and Disability Resource Network (ADRN)",
            },
            {
              id: "TqLWs965B0e0EmYnaShjOQ",
              label: "Center for Independent Living (CIL)",
            },
            {
              id: "XStmnayyVE6WDw2lhN682g",
              label: "Legal Assistance Organization",
            },
            {
              id: "Zc6FUo3Ee0i3kbbcYa3G8Q",
              label: "Other Community-Based Organization",
            },
            {
              id: "rXh51BskxUGvkWUaYtEVIA",
              label: "Subcontractor",
            },
            {
              id: "vXL3hGQHSUazZCZzQyX3hw",
              label: "Enrollment Broker",
            },
            {
              id: "xTEi7XgUvkGM4rU3FRaHDQ",
              label: "Consultant",
            },
            {
              id: "9vVNL9HLokKe3c6h4WAiAg",
              label: "Academic/Research Organization",
            },
            {
              id: "dgtCWe8drkivORajgmqYRw",
              label: "Other, specify",
              children: [
                {
                  id: "bssEntity_entityType-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "bssEntity_entityType",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "bssEntity_entityRole",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "E.IX.2 BSS entity role",
          hint: "What are the roles performed by the BSS entity? Check all that apply. Refer to 42 CFR 438.71(b).",
          choices: [
            {
              id: "aZ0uOjpYOE6zavUNXcZYrw",
              label: "Enrollment Broker/Choice Counseling",
            },
            {
              id: "eU2xXBr95USN7KG6VuVs3w",
              label: "Beneficiary Outreach",
            },
            {
              id: "GWTY3GEjGU2OhEOpqzm2AQ",
              label: "LTSS Complaint Access Point",
            },
            {
              id: "aF6Gt3rcsEibKmYvlKUH2A",
              label: "LTSS Grievance/Appeals Education",
            },
            {
              id: "gNJg0G5VXUmOk86B5pvyRg",
              label: "LTSS Grievance/Appeals Assistance",
            },
            {
              id: "cCu7xtpMDEGeJwbuaiO5XQ",
              label: "Review/Oversight of LTSS Data",
            },
            {
              id: "HcfrzcLqYU6faU0EBi9dfA",
              label: "Other, specify",
              children: [
                {
                  id: "bssEntity_entityRole-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "bssEntity_entityRole",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
};
