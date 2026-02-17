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
                "This section must be completed if any in lieu of services or settings (ILOSs) <em>other than short term stays in an Institution for Mental Diseases (IMD)</em> are authorized for this managed care program. <strong>Enter the name of each ILOS offered as it is identified in the managed care plan contract(s).</strong> (See 42 CFR 438.3(e)(2) and 438.16).",
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
