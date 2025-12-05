import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const reportingPeriodRoute: FormRoute = {
  name: "Reporting Period",
  path: "/mcpar/program-information/reporting-period",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section A: Program Information",
      subsection: "Reporting Period",
      spreadsheet: "A_Program_Info",
    },
  },
  form: {
    id: "arp",
    fields: [
      {
        id: "reportingPeriodStartDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.DATE,
        props: {
          label: "A.5a Reporting period start date",
          hint: "Auto-populated from report dashboard.",
          disabled: true,
        },
      },
      {
        id: "reportingPeriodEndDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.DATE,
        props: {
          label: "A.5b Reporting period end date",
          hint: "Auto-populated from report dashboard.",
          disabled: true,
        },
      },
      {
        id: "programName",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "A.6 Program name",
          hint: "Auto-populated from report dashboard.",
          disabled: true,
        },
      },
    ],
  },
};
