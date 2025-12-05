import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const programIntegrityRoute: FormRoute = {
  name: "X: Program Integrity",
  path: "/mcpar/program-level-indicators/program-integrity",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section C: Program-Level Indicators",
      subsection: "Topic X: Program Integrity",
      spreadsheet: "C1_Program_Set",
    },
  },
  form: {
    id: "cpi",
    fields: [
      {
        id: "program_prohibitedAffiliationDisclosure",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "C1.X.3 Prohibited affiliation disclosure",
          hint: "Did any plans disclose prohibited affiliations? If the state took action, enter those actions under D: Plan-level Indicators, Section VIII - Sanctions (Corresponds with Tab D3 in the Excel Workbook). Refer to 42 CFR 438.610(d).",
          choices: [
            {
              id: "7emiYPcs60GzXxKS5Pc9bg",
              label: "Yes",
            },
            {
              id: "SCGdBlpSQU6OVWAf3mDlMQ",
              label: "No",
            },
          ],
        },
      },
    ],
  },
};
