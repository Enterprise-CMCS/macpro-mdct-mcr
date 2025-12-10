import {
  AddEntityDrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const analysisMethodsRoute: AddEntityDrawerFormRoute = {
  name: "D. Analysis methods",
  path: "/naaar/state-and-program-information/analysis-methods",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.ANALYSIS_METHODS,
  verbiage: {
    intro: {
      section: "I. State and program information",
      subsection: "D. Analysis methods",
      info: [
        {
          type: "p",
          content:
            "States should use this section of the tab to report on the analyses that are used to assess plan compliance with the state’s 42 C.F.R. § 438.68 and 42 C.F.R. § 438.206 standards.",
        },
      ],
    },
    dashboardTitle: "Analysis method <br/> Frequency and plan utilization",
    addEntityButtonText: "Add other analysis method",
    deleteEntityButtonAltText: "Delete other analysis method",
    deleteModalTitle: "Are you sure you want to delete this analysis method?",
    deleteModalConfirmButtonText: "Yes, delete method",
    deleteModalWarning:
      "Are you sure you want to proceed? You will lose all information entered for this analysis method in the NAAAR. The method will remain in previously submitted NAAAR reports if applicable.",
    drawerTitle: "Analysis method: {{name}}",
    missingEntityMessage: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "This program is missing plan names. This section cannot be completed until all managed care plan names that are contracted for the program are added. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/naaar/state-and-program-information/add-plans",
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
  drawerForm: {
    id: "iam",
    fields: [
      {
        id: "analysis_applicable",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "Is this analysis method used to assess plan compliance?",
          hint: "Select “Yes” if the method is utilized to assess plan compliance with the state’s standards, as required at 42 C.F.R. § 438.68.",
          choices: [
            {
              id: "KHvMO9SzSrkBhqCobPBUOY",
              label: "No",
            },
            {
              id: "Br7jPULxsYgbiuHV9zwyIB",
              label: "Yes",
              children: [
                {
                  id: "analysis_method_frequency",
                  type: ReportFormFieldType.RADIO,
                  validation: {
                    type: ValidationType.RADIO,
                    nested: true,
                    parentFieldName: "analysis_applicable",
                  },
                  props: {
                    label: "Frequency of analysis",
                    choices: [
                      {
                        id: "Sol1W6HJCixyOVxw4vDgXQ",
                        label: "Weekly",
                      },
                      {
                        id: "YjI3qT3Ml9cZfP4a1RV6G9",
                        label: "Bi-weekly",
                      },
                      {
                        id: "L8q1N1DXEYv8LsDfGkdbOe",
                        label: "Monthly",
                      },
                      {
                        id: "05ThR4UN7kYDGpKaTWESOB",
                        label: "Bi-monthly",
                      },
                      {
                        id: "Y0Rkz7e3Kkxw0T4aFDb38j",
                        label: "Quarterly",
                      },
                      {
                        id: "mcn99pzTOqnEmr3uXiEOYs",
                        label: "Semi-annually",
                      },
                      {
                        id: "tDWWkfuHigkFOi1ADUUHVb",
                        label: "Annually",
                      },
                      {
                        id: "r938vpeMJxkPOqk53N7qW0",
                        label: "Other, specify",
                        children: [
                          {
                            id: "analysis_method_frequency-otherText",
                            type: ReportFormFieldType.TEXTAREA,
                            validation: {
                              type: ReportFormFieldType.TEXT,
                              nested: true,
                              parentFieldName: "analysis_method_frequency",
                            },
                          },
                        ],
                      },
                      {
                        id: "WkqIis4bGGtK8Nzzqa6rPl",
                        label: "Varies by plan",
                      },
                    ],
                  },
                },
                {
                  id: "analysis_method_applicable_plans",
                  type: ReportFormFieldType.CHECKBOX,
                  validation: {
                    type: ValidationType.CHECKBOX,
                    nested: true,
                    parentFieldName: "analysis_applicable",
                    parentOptionId:
                      "analysis_applicable-Br7jPULxsYgbiuHV9zwyIB",
                  },
                  props: {
                    label: "Plans using this method",
                    choices: [
                      {
                        label: "Plans",
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
  addEntityDrawerForm: {
    id: "iamnew",
    fields: [
      {
        id: "custom_analysis_method_name",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "Analysis method",
          hint: "Enter an analysis method utilized to assess plan compliance with the state’s 42 C.F.R. § 438.68 standards that is not already listed in the system.",
        },
      },
      {
        id: "custom_analysis_method_description",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "Analysis method description",
          hint: "Describe the method.",
        },
      },
      {
        id: "analysis_method_frequency",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "Frequency of analysis",
          choices: [
            {
              id: "Sol1W6HJCixyOVxw4vDgXQ",
              label: "Weekly",
            },
            {
              id: "YjI3qT3Ml9cZfP4a1RV6G9",
              label: "Bi-weekly",
            },
            {
              id: "L8q1N1DXEYv8LsDfGkdbOe",
              label: "Monthly",
            },
            {
              id: "05ThR4UN7kYDGpKaTWESOB",
              label: "Bi-monthly",
            },
            {
              id: "Y0Rkz7e3Kkxw0T4aFDb38j",
              label: "Quarterly",
            },
            {
              id: "mcn99pzTOqnEmr3uXiEOYs",
              label: "Semi-annually",
            },
            {
              id: "tDWWkfuHigkFOi1ADUUHVb",
              label: "Annually",
            },
            {
              id: "r938vpeMJxkPOqk53N7qW0",
              label: "Other, specify",
              children: [
                {
                  id: "analysis_method_frequency-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "analysis_method_frequency",
                  },
                },
              ],
            },
            {
              id: "WkqIis4bGGtK8Nzzqa6rPl",
              label: "Varies by plan",
            },
          ],
        },
      },
      {
        id: "analysis_method_applicable_plans",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "Plans utilizing this method",
          choices: [
            {
              id: "generatedCheckbox",
              label: "Plans (generated)",
            },
          ],
        },
      },
    ],
  },
};
