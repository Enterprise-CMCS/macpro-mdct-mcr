import {
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
  ModalDrawerRoute,
} from "../../../../utils/types";

export const sanctionsRoute: ModalDrawerRoute = {
  name: "VIII: Sanctions",
  path: "/mcpar/plan-level-indicators/sanctions",
  pageType: PageTypes.MODAL_DRAWER,
  entityType: EntityType.SANCTIONS,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic VIII. Sanctions",
      spreadsheet: "D3_Plan_Sanctions",
      info: [
        {
          type: "p",
          content:
            "Describe sanctions that the state has issued for each plan. Report all known actions across the following domains: sanctions, administrative penalties, corrective action plans, other. The state should include all sanctions the state issued regardless of what entity identified the non-compliance (e.g. the state, an auditing body, the plan, a contracted entity like an external quality review organization).",
        },
        {
          type: "p",
          content:
            "42 CFR 438.66(e)(2)(viii) specifies that the MCPAR include the results of any sanctions or corrective action plans imposed by the State or other formal or informal intervention with a contracted MCO, PIHP, PAHP, or PCCM entity to improve performance.",
        },
      ],
    },
    dashboardTitle: "Sanction total count:",
    countEntitiesInTitle: true,
    addEntityButtonText: "Add sanction",
    editEntityButtonText: "Edit sanction",
    addEditModalAddTitle: "Add sanction",
    addEditModalEditTitle: "Edit sanction",
    addEditModalMessage:
      "Complete the remaining indicators for this sanction by saving the sanction and selecting “Enter sanction details”.",
    deleteEntityButtonAltText: "Delete sanction",
    deleteModalTitle: "Delete plan sanction?",
    deleteModalConfirmButtonText: "Yes, delete sanction",
    deleteModalWarning:
      "You will lose all information entered for this sanction. Are you sure you want to proceed?",
    entityUnfinishedMessage:
      "Complete the remaining indicators for this plan sanction by selecting “Enter sanction details”.",
    enterEntityDetailsButtonText: "Enter sanction details",
    editEntityDetailsButtonText: "Edit sanction details",
    drawerTitle: "{{action}} details for sanction",
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
  modalForm: {
    id: "ds-modal",
    fields: [
      {
        id: "sanction_interventionType",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D3.VIII.1 Intervention type",
          hint: "What type of intervention? Select one.",
          choices: [
            {
              id: "lF2t0ruXf0aPrT3EDd3IXA",
              label: "Civil monetary penalty",
            },
            {
              id: "ZiV7GVUYRE6FUOsNACDZdg",
              label: "Suspension of new enrollment",
            },
            {
              id: "Ie8Labh4MUOYeXjxLGdTOA",
              label: "Fine",
            },
            {
              id: "U5kYTTiBwkSO9nkDBad6Gw",
              label: "Corrective action plan",
            },
            {
              id: "AexbMuj1y0KnY6UqkW5o0Q",
              label:
                "All compliance-related notices or letters (e.g. warnings, non-compliance)",
            },
            {
              id: "d45iDfmlk0S3u8AYTttYXA",
              label: "Liquidated damages",
            },
            {
              id: "U4ALG08NZkOSEuTkOlf20w",
              label: "Other, specify",
              children: [
                {
                  id: "sanction_interventionType-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "sanction_interventionType",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "sanction_interventionTopic",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D3.VIII.2 Plan performance issue",
          hint: "What area of plan performance was primarily associated with the intervention? Select one.",
          choices: [
            {
              id: "x6Cwd4oSrki6De4SnpjrMQ",
              label: "Discrimination",
            },
            {
              id: "HzVmv9UDIkKxZIogdJp7xQ",
              label: "False information",
            },
            {
              id: "YBSfuKgdC0uEHGv4p0bi1g",
              label: "Financial issues",
            },
            {
              id: "kB2nkoh27EG74eGG44pBrg",
              label: "Reporting (timeliness, completeness, accuracy)",
            },
            {
              id: "MXaon6GrskylPnGm2QHnJw",
              label:
                "Quality measure performance (e.g., failure to meet benchmarks or make progress on performance improvement projects)",
            },
            {
              id: "Ru46dEgst0eXi5s6bUA4Jg",
              label: "Timely access to care",
            },
            {
              id: "GuYmG53wQ2sWmGlVnBIxnIof",
              label:
                "Mental Health and Substance Use Disorder Parity compliance",
            },
            {
              id: "0AmKeqywuQrFOItpTRLxu5KG",
              label: "Timely payments to providers",
            },
            {
              id: "1J5jsCbue8SyfkP8JqQv1piw",
              label: "Network adequacy",
            },
            {
              id: "uFRKwEVzfE21KzEotYRkUw",
              label: "Other, specify",
              children: [
                {
                  id: "sanction_interventionTopic-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "sanction_interventionTopic",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "sanction_planName",
        type: ReportFormFieldType.DROPDOWN,
        validation: ValidationType.DROPDOWN,
        props: {
          label: "D3.VIII.3 Plan name",
          hint: "What is the name of the plan attached to the sanction or corrective action plan? Select plan name.",
          options: "plans",
        },
      },
      {
        id: "sanction_interventionReason",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "D3.VIII.4 Reason for intervention",
          hint: "What was the reason for intervention? Add a description.",
        },
      },
    ],
  },
  drawerForm: {
    id: "ds",
    fields: [
      {
        id: "sanction_noncomplianceInstances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D3.VIII.5 Instances of non-compliance",
          hint: "How many instances were there of non-compliance in the reporting year? Add a number.",
          mask: "comma-separated",
        },
      },
      {
        id: "sanction_dollarAmount",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D3.VIII.6 Sanction amount",
          hint: "Add a dollar amount. Enter N/A for sanctions that do not carry financial penalties.",
          mask: "currency",
        },
      },
      {
        id: "sanction_assessmentDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.DATE,
        props: {
          label: "D3.VIII.7 Date assessed",
          hint: "When was the plan sanctioned? Select a date.",
        },
      },
      {
        id: "sanction_remediationCompleted",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D3.VIII.8 Remediation date non-compliance was corrected",
          hint: "Was the non-compliance remediated?",
          choices: [
            {
              id: "J9FTVN9fJpgXX6X2xJiAiP",
              label: "Yes, remediated",
              children: [
                {
                  id: "sanction_remediationDate",
                  type: ReportFormFieldType.DATE,
                  validation: {
                    type: ValidationType.DATE,
                    nested: true,
                    parentFieldName: "sanction_remediationCompleted",
                  },
                  props: {
                    label:
                      "D3.VIII.8a Remediation date non-compliance was corrected",
                    hint: "What day was it remediated, i.e. When was the non-compliance corrected? Select a date.",
                  },
                },
              ],
            },
            {
              id: "uStbF2QLllAlyUvxU9CBWH",
              label: "Remediation in progress",
            },
            {
              id: "oAcvChnL6FLUJorh8XfgyR",
              label: "No, no remediation",
            },
          ],
        },
      },
      {
        id: "sanction_correctiveActionPlan",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D3.VIII.9 Corrective action plan",
          hint: "Has the state sanctioned the plan within the previous two years, (e.g. corrective action plans or other informal interventions such as special outreach, focused technical assistance)?",
          choices: [
            {
              id: "doioZOW5CUmcCfO5TQXpbw",
              label: "Yes",
            },
            {
              id: "E3KZlNwYTEGfvk5zuB426A",
              label: "No",
            },
          ],
        },
      },
    ],
  },
};
