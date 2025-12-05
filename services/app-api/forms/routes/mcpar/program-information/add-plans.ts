import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const addPlansRoute: FormRoute = {
  name: "Add Plans",
  path: "/mcpar/program-information/add-plans",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section A: Program Information",
      subsection: "Add plans (A.7)",
      info: "Enter the name of each plan that participates in the program for which the state is reporting data.",
      spreadsheet: "A_Program_Info",
    },
  },
  form: {
    id: "aap",
    fields: [
      {
        id: "plans",
        type: ReportFormFieldType.DYNAMIC,
        validation: ValidationType.DYNAMIC,
        props: {
          label: "Plan name",
        },
      },
    ],
  },
};
