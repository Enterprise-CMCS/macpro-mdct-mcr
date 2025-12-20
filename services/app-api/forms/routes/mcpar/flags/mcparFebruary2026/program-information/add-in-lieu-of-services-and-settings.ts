import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../../utils/types";

export const addInLieuOfServicesAndSettingsRoute: FormRoute = {
  name: "Add In Lieu of Services and Settings",
  path: "/mcpar/program-information/add-in-lieu-of-services-and-settings",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section A: Program Information",
      subsection: "Add In Lieu of Services and Settings (A.9)",
      info: [
        {
          type: "p",
          children: [
            {
              type: "html",
              content:
                "This section must be completed if any ILOSs <em>other than short term stays in an Institution for Mental Diseases (IMD)</em> are authorized for this managed care program. <strong>Enter the name of each ILOS offered as it is identified in the managed care plan contract(s).</strong> ",
            },
            {
              type: "externalLink",
              content: "Guidance on In Lieu of Services on Medicaid.gov",
              props: {
                href: "https://www.medicaid.gov/medicaid/managed-care/guidance/lieu-of-services-and-settings/index.html",
                target: "_blank",
                "aria-label": "Guidance on ILOS on Medicaid.gov.",
              },
            },
            {
              type: "html",
              content: ".",
            },
          ],
        },
      ],
      spreadsheet: "A_Program_Info",
    },
  },
  form: {
    id: "aailos",
    fields: [
      {
        id: "ilos",
        type: ReportFormFieldType.DYNAMIC,
        validation: ValidationType.DYNAMIC_OPTIONAL,
        props: {
          label: "ILOS name",
        },
      },
    ],
  },
};
