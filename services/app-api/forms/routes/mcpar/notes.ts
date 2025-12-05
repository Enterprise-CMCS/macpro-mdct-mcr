import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../utils/types";

export const notesRoute: FormRoute = {
  name: "F: Notes",
  path: "/mcpar/notes",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section F: Notes",
      subsection: "Notes",
      spreadsheet: "F_Notes",
      info: [
        {
          type: "p",
          content:
            "Use this section to optionally add more context about your submission. If you choose not to respond, proceed to “Review & submit.”",
        },
      ],
    },
  },
  form: {
    id: "fno",
    fields: [
      {
        id: "fnotes",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "F.1 Notes (optional)",
        },
      },
    ],
  },
};
