import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const providerTypeCoverageRoute: FormRoute = {
  name: "C. Provider type coverage",
  path: "/naaar/state-and-program-information/provider-type-coverage",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "I. State and program information",
      subsection: "C. Provider type coverage",
      info: "If your standards apply to more specific provider types, select the most closely aligned provider type category and utilize the subcategory fields available in Section II. Program-level access and network adequacy standards under “Provider type covered by standard”.",
    },
  },
  form: {
    id: "iptc",
    fields: [
      {
        id: "providerTypes",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "Select all core provider types covered in the program",
          choices: [
            {
              id: "UZK4hxPVnuYGcIgNzYFHCk",
              label: "Primary Care",
            },
            {
              id: "uITThePQiXntwGGViPTD62",
              label: "Specialist",
              hint: "Include all specialists (except for Mental health) within this category.",
            },
            {
              id: "9kBoKCLD1dYizieU5psnJi",
              label: "Mental health",
              hint: "Include all mental health specialists within this category.",
            },
            {
              id: "qbR8X0YAh8vObedJPx6QTJ",
              label: "Substance Use Disorder (SUD)",
            },
            {
              id: "kV7553HIWXekySIFLiMXLW",
              label: "OB/GYN",
            },
            {
              id: "nzmRTbJeqBCoAabR4oHrrh",
              label: "Hospital",
            },
            {
              id: "cb4y58UmsRXVITpWL7l9up",
              label: "Pharmacy",
            },
            {
              id: "tlzAMYfH4I7iIl5pjqAm7R",
              label: "Dental",
            },
            {
              id: "WrMpSdivds4c0XfN2RPlRd",
              label: "LTSS",
            },
          ],
        },
      },
    ],
  },
};
