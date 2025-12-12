import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
} from "../../../../../../utils/types";

export const financialPerformanceRoute: DrawerFormRoute = {
  name: "II: Financial Performance",
  path: "/mcpar/plan-level-indicators/financial-performance",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.PLANS,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic II. Financial Performance",
      spreadsheet: "D1_Plan_Set",
    },
    dashboardTitle: "Report financial performance for each plan",
    drawerTitle: "Report financial performance for {{name}}",
    missingEntityMessage: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/mcpar/program-information/add-plans",
            },
          },
        ],
      },
    ],
  },
  drawerForm: {
    id: "dfp",
    fields: [],
  },
};
