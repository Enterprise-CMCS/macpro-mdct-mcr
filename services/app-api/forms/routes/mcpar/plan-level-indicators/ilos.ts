import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const ilosRoute: DrawerFormRoute = {
  name: "XI: ILOS",
  path: "/mcpar/plan-level-indicators/ilos",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.PLANS,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic XI: ILOS",
      spreadsheet: "D4_Plan_ILOS",
      info: [
        {
          type: "p",
          content:
            "If ILOSs are authorized for this program, report for each plan: if the plan offered any ILOS; if “Yes”, which ILOS the plan offered; and utilization data for each ILOS offered. If the plan offered an ILOS during the reporting period but there was no utilization, check that the ILOS was offered but enter “0” for utilization.",
        },
      ],
    },
    dashboardTitle:
      "Report ILOS utilization for each managed care plan during the contract rating period.",
    drawerTitle: "",
    missingEntityMessage: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the managed care plans that serve enrollees in the program. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/mcpar/program-information/add-plans",
            },
          },
          {
            type: "html",
            content: ".",
          },
        ],
      },
    ],
    missingIlosMessage: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "This program is missing ILOSs. You won’t be able to complete this section until you’ve added all the names of authorized ILOSs for this program, if applicable. ",
          },
          {
            type: "internalLink",
            content: "Add ILOSs",
            props: {
              to: "/mcpar/program-information/add-in-lieu-of-services-and-settings",
            },
          },
          {
            type: "html",
            content:
              ". If ILOSs are not authorized for this program, proceed to the next section.",
          },
        ],
      },
    ],
    missingPlansAndIlosMessage: [
      {
        type: "p",
        content: "This program is missing plans and ILOSs.",
      },
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "If ILOSs are authorized for this program, you won’t be able to complete this section until you’ve:",
          },
          {
            type: "ol",
            children: [
              {
                type: "li",
                children: [
                  {
                    type: "html",
                    content:
                      "Added all the managed care plans that serve enrollees in the program by going to ",
                  },
                  {
                    type: "internalLink",
                    content: "Add Plans",
                    props: {
                      to: "/mcpar/program-information/add-plans",
                    },
                  },
                  {
                    type: "html",
                    content: ", and",
                  },
                ],
              },
              {
                type: "li",
                children: [
                  {
                    type: "html",
                    content:
                      "Added all the names of authorized ILOSs for this program. ",
                  },
                  {
                    type: "internalLink",
                    content: "Add ILOSs",
                    props: {
                      to: "/mcpar/program-information/add-in-lieu-of-services-and-settings",
                    },
                  },
                  {
                    type: "html",
                    content: ".",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "p",
        content:
          "If ILOSs are not authorized for this program, proceed to the next section.",
      },
    ],
  },
  drawerForm: {
    id: "dilos",
    fields: [
      {
        id: "plan_ilosOfferedByPlan",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO_OPTIONAL,
        props: {
          label: "D4.XI.1 ILOSs offered by plan",
          hint: "Indicate whether this plan offered any ILOS to their enrollees.",
          choices: [
            {
              id: "lHVzkc6Zk12TvS6ocYXeS2n9",
              label: "No ILOSs were offered by this plan",
            },
            {
              id: "1qdYiWh0SaO7IQ41NeOt0uJU",
              label: "Yes, at least 1 ILOS is offered by this plan",
              children: [
                {
                  id: "plan_ilosUtilizationByPlan",
                  type: ReportFormFieldType.CHECKBOX,
                  validation: {
                    type: ValidationType.CHECKBOX,
                    nested: true,
                    parentFieldName: "plan_ilosOfferedByPlan",
                    parentOptionId:
                      "plan_ilosOfferedByPlan-1qdYiWh0SaO7IQ41NeOt0uJU",
                  },
                  props: {
                    label: "D4.XI.2a ILOSs utilization by plan",
                    hint: "Select all ILOSs offered by this plan during the contract rating period. For each ILOS offered by the plan, enter the deduplicated number of enrollees that utilized this ILOS during the contract rating period. If the plan offered this ILOS during the contract rating period but there was no utilization, enter “0”.",
                    choices: [
                      {
                        label: "D4.XI.2b",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
};
