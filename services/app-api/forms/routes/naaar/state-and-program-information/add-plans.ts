import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const addPlansRoute: FormRoute = {
  name: "B. Add plans",
  path: "/naaar/state-and-program-information/add-plans",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "I. State and program information",
      subsection: "B. Add plans",
      info: [
        {
          type: "p",
          content:
            "Enter the name of each plan that participates in the program for which the state is reporting data. If the state is submitting this form because it’s entering into a contract with a plan or because there’s a significant change in a plan’s operations, include only the name of the applicable plan.",
        },
        {
          type: "p",
          content:
            "Plan names should match the plan names used in your Managed Care Plan Annual Report (MCPAR) for this program for the same reporting period.",
        },
      ],
    },
  },
  form: {
    id: "iap",
    fields: [
      {
        id: "plans",
        type: ReportFormFieldType.DYNAMIC,
        validation: ValidationType.DYNAMIC,
        props: {
          label: "Plan name",
          isRequired: true,
        },
      },
    ],
  },
};
