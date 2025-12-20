import { FormRoute, PageTypes } from "../../../../../../../utils/types";

export const networkAdequacyRoute: FormRoute = {
  name: "Network Adequacy",
  path: "/mcpar/program-level-indicators/availability-and-accessibility/network-adequacy",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section C: Program-Level Indicators",
      subsection: "Topic V. Availability, Accessibility and Network Adequacy",
      spreadsheet: "C1_Program_Set",
      info: [
        {
          type: "heading",
          as: "h4",
          content: "Network Adequacy",
        },
      ],
    },
  },
  form: {
    id: "cna",
    fields: [],
  },
};
