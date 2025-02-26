import {
  CustomHtmlElement,
  OverlayReportPageShape,
  OverlayReportPageVerbiage,
} from "types";

export const mockFormField = {
  id: "mock-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock text field",
  },
};

export const mockOptionalFormField = {
  id: "mock-optional-text-field",
  type: "text",
  validation: "textOptional",
  props: {
    label: "mock optional field",
    hint: "optional Details",
    styleAsOptional: true,
  },
};

export const mockNumberField = {
  id: "mock-number-field",
  type: "number",
  validation: "number",
  props: {
    label: "mock number field",
  },
};

export const mockDateField = {
  id: "mock-date-field",
  type: "date",
  validation: "date",
  props: {
    label: "mock date field",
  },
};

export const mockRepeatedFormField = {
  id: "mock-text-field",
  type: "text",
  validation: "text",
  repeat: "plans",
  props: {
    label: "mock text field",
  },
};

export const mockModalFormField = {
  id: "mock-modal-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock modal text field",
  },
};

export const mockModalOverlayFormField = {
  id: "mock-modal-overlay-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock modal overlay text field",
  },
};

export const mockDrawerFormField = {
  id: "mock-drawer-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock drawer text field",
  },
};

export const mockNestedFormField = {
  id: "mock-nested-field",
  type: "radio",
  validation: "radio",
  props: {
    label: "mock radio field",
    choices: [
      { id: "option1uuid", label: "option 1" },
      { id: "option2uuid", label: "option 2" },
      {
        id: "option3uuid",
        label: "option 3",
        children: [mockFormField],
      },
    ],
  },
};

export const mockNestedField = {
  id: "report_nested-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock text field",
  },
};

export const mockNestedReportFormField = {
  id: "mock-nested-field",
  type: "radio",
  validation: "radio",
  props: {
    label: "mock radio field",
    choices: [
      { id: "option1uuid", label: "option 1" },
      { id: "option2uuid", label: "option 2" },
      {
        id: "option3uuid",
        label: "option 3",
        children: [mockNestedField],
      },
    ],
  },
};

export const mockPlanField = {
  id: "plans",
  type: "dynamic",
  validation: "dynamic",
  props: {
    label: "Plan name",
  },
};

export const mockSectionHeaderField = {
  type: "sectionHeader",
  id: "testfield",
  props: {
    divider: "top",
    content: "Test Content",
  },
};

export const mockForm = {
  id: "mock-form-id",
  fields: [mockFormField],
};

export const mockModalForm = {
  id: "mock-modal-form-id",
  fields: [mockModalFormField],
};

export const mockDrawerForm = {
  id: "mock-drawer-form-id",
  fields: [mockDrawerFormField],
};

export const mockEmptyDrawerForm = {
  id: "mock-drawer-form-id",
  fields: [],
};

export const mockModalOverlayForm = {
  id: "mock-modal-overlay-form-id",
  fields: [mockFormField, mockNumberField, mockOptionalFormField],
};

export const mockPlanFilledForm = {
  id: "mock-form-id",
  fields: [mockPlanField],
};

export const mockNestedForm = {
  id: "mock-nested-form-id",
  fields: [mockNestedFormField],
};

export const mockDynamicForm = {
  id: "mock-dynamic-form-id",
  fields: [mockPlanField],
};

export const mockLinksForm = {};

export const mockNonFieldForm = {
  id: "mock-non-form-id",
  fields: [mockSectionHeaderField],
};

export const mockVerbiageIntro = {
  section: "mock section",
  subsection: "mock subsection",
  spreadsheet: "mock item",
  info: [
    {
      type: "html",
      content: "mock html",
    },
  ],
  editEntityButtonText: "Edit",
  enterReportText: "Enter Details",
  tableHeader: "Mock table header",
};

export const mockStandardReportPageJson = {
  name: "mock-route-1",
  path: "/mock/mock-route-1",
  pageType: "standard",
  verbiage: {
    intro: mockVerbiageIntro,
  },
  form: mockForm,
};

export const mockDynamicReportPageJson = {
  name: "mock-route-1",
  path: "/mock/mock-route-1",
  pageType: "standard",
  verbiage: {
    intro: mockVerbiageIntro,
  },
  form: mockDynamicForm,
};

export const mockDrawerReportPageJson = {
  name: "mock-route-2a",
  path: "/mock/mock-route-2a",
  pageType: "drawer",
  entityType: "plans",
  verbiage: {
    intro: mockVerbiageIntro,
    dashboardTitle: "Mock dashboard title",
    drawerTitle: "Mock drawer title",
  },
  drawerForm: mockDrawerForm,
};

export const mockNestedReportPageJson = {
  name: "mock-route-2a",
  path: "/mock/mock-route-2a",
  pageType: "drawer",
  entityType: "plans",
  verbiage: {
    intro: mockVerbiageIntro,
    dashboardTitle: "Mock dashboard title",
    drawerTitle: "Mock drawer title",
  },
  drawerForm: mockNestedForm,
};

export const mockMcparIlosPageJson = {
  name: "mock-route",
  path: "/mcpar/plan-level-indicators/ilos",
  pageType: "drawer",
  entityType: "ilos",
  verbiage: {
    intro: mockVerbiageIntro,
    dashboardTitle: "Mock dashboard title",
    drawerTitle: "Mock drawer title",
  },
  drawerForm: {
    id: "dilos",
    fields: [
      {
        id: "mock-field-id",
        props: {
          choices: [
            {
              id: "mock-choice-id-1",
              label: "mock label 1 - ILOS",
            },
            {
              id: "mock-choice-id-2",
              label: "mock label 2",
              children: [
                {
                  id: "mock-child-id-0",
                  type: "radio",
                  validation: {
                    type: "radio",
                    nested: true,
                    parentFieldName: "ilos",
                  },
                  props: {
                    label: "ILOSs utilization by plan",
                    choices: [],
                  },
                },
                {
                  id: "mock-child-id-1",
                  type: "checkbox",
                  validation: {
                    type: "radio",
                    nested: true,
                    parentFieldName: "mock-field-id",
                    parentOptionId: "mock-field-id-mock-choice-id-1",
                  },
                },
              ],
            },
          ],
        },
        type: "radio",
        validation: "radio",
      },
    ],
  },
};

export const mockNaaarAnalysisMethodsPageJson = {
  name: "mock-route",
  path: "/naaar/analysis-methods",
  pageType: "drawer",
  entityType: "analysisMethods",
  verbiage: {
    intro: mockVerbiageIntro,
    dashboardTitle: "Mock dashboard title",
    drawerTitle: "Mock drawer title",
    addEntityButtonText: "Add other analysis method",
    deleteModalTitle: "Are you sure you want to delete this analysis method?",
    deleteModalConfirmButtonText: "Yes, delete method",
  },
  drawerForm: {
    id: "am",
    fields: [
      {
        id: "mock-field-id",
        props: {
          choices: [
            {
              id: "mock-choice-id-1",
              label: "mock label 1",
            },
            {
              id: "mock-choice-id-2",
              label: "mock label 2",
              children: [
                {
                  id: "mock-child-id-0",
                  type: "radio",
                  validation: {
                    type: "radio",
                    nested: true,
                    parentFieldName: "analysis_applicable",
                  },
                  props: {
                    label: "Frequency of analysis",
                    choices: [],
                  },
                },
                {
                  id: "mock-child-id-1",
                  type: "checkbox",
                  validation: {
                    type: "radio",
                    nested: true,
                    parentFieldName: "mock-field-id",
                    parentOptionId: "mock-field-id-mock-choice-id-1",
                  },
                  props: {
                    label: "Plans utilizing this method",
                    choices: [],
                  },
                },
              ],
            },
          ],
        },
        type: "radio",
        validation: "radio",
      },
    ],
  },
  addEntityDrawerForm: {
    id: "am_custom",
    fields: [
      {
        id: "mock_custom_analysis_method_name",
        type: "text",
        validation: "text",
        props: {
          label: "Analysis method",
        },
      },
      {
        id: "mock_custom_analysis_method_description",
        type: "textarea",
        validation: "textarea",
        props: {
          label: "description",
        },
      },
      {
        id: "mock_analysis_method_frequency",
        type: "radio",
        props: {
          label: "Frequency of analysis",
          choices: [{ id: "option1", label: "Weekly" }],
        },
      },
      {
        id: "mock_analysis_method_applicable_plans",
        type: "checkbox",
        props: {
          label: "Plans utilizing this method",
          choices: [{ label: "Plan 1" }],
        },
      },
    ],
  },
};

export const mockNaaarStandardsPageJson = {
  name: "mock-route",
  path: "/naaar/program-level-access-and-network-adequacy-standards",
  pageType: "drawer",
  entityType: "standards",
  verbiage: {
    intro: mockVerbiageIntro,
    dashboardTitle: "Mock dashboard title",
    drawerTitle: "Mock drawer title",
    countEntitiesInTitle: true,
    addEntityButtonText: "Add standard",
  },
  drawerForm: {
    id: "standards",
    fields: [
      {
        id: "mock-field-id-1",
        props: {
          choices: [
            {
              id: "mock-choice-id-1",
              label: "mock label 1",
            },
          ],
        },
        type: "radio",
        validation: "radio",
      },
      {
        id: "mock-field-id-2",
        props: {
          choices: [
            {
              id: "mock-choice-id-1",
              label: "mock label 1",
              children: [
                {
                  id: "mock-child-1",
                  props: {
                    choices: [],
                  },
                },
                {
                  id: "mock-child-2",
                  props: {
                    choices: [],
                  },
                },
                {
                  id: "mock-child-3",
                  props: {
                    choices: [],
                  },
                },
              ],
            },
            {
              id: "mock-choice-id-2",
              label: "mock label 2",
              children: [
                {
                  id: "mock-child-1",
                  props: {
                    choices: [],
                  },
                },
                {
                  id: "mock-child-2",
                  props: {
                    choices: [],
                  },
                },
                {
                  id: "mock-child-3",
                  props: {
                    choices: [],
                  },
                },
              ],
            },
          ],
        },
        type: "radio",
        validation: "radio",
      },
    ],
  },
};

export const mockModalDrawerReportPageVerbiage = {
  intro: mockVerbiageIntro,
  dashboardTitle: "Mock dashboard title",
  missingReportingPeriodMessage: "Mock entity missing reporting period message",
  addEntityButtonText: "Mock add entity button text",
  editEntityButtonText: "Mock edit entity button text",
  addEditModalAddTitle: "Mock add/edit entity modal add title",
  addEditModalEditTitle: "Mock add/edit entity modal edit title",
  addEditModalMessage: "Mock add/edit entity modal message",
  deleteEntityButtonAltText: "Mock delete entity button alt text",
  deleteModalTitle: "Mock delete modal title",
  deleteModalConfirmButtonText: "Mock delete modal confirm button text",
  deleteModalWarning: "Mock delete modal warning",
  entityMissingResponseMessage: "Mock entity missing response message",
  entityUnfinishedMessage: "Mock entity unfinished messsage",
  enterEntityDetailsButtonText: "Mock enter entity details button text",
  editEntityDetailsButtonText: "Mock edit entity details button text",
  drawerTitle: "Mock drawer title",
  drawerNoFormMessage: "Mock no form fields here",
  tableHeader: "Mock table header",
};

export const mockModalOverlayReportPageVerbiage = {
  intro: mockVerbiageIntro,
  dashboardTitle: "Mock dashboard title",
  addEditModalHint: "Mock modal hint",
  countEntitiesInTitle: true,
  tableHeader: "Mock table header",
  addEntityButtonText: "Mock add entity button text",
  emptyDashboardText: "Mock empty dashboard text",
  editEntityButtonText: "Mock edit entity button text",
  deleteModalTitle: "Mock delete modal title",
  deleteModalConfirmButtonText: "Mock delete modal confirm button text",
  deleteModalWarning: "Mock delete modal warning",
  enterReportText: "Mock enter report text",
};

export const mockOverlayReportPageVerbiage: OverlayReportPageVerbiage = {
  intro: mockVerbiageIntro,
  requiredMessages: {
    plans: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content: "This program is missing required information.",
          },
        ],
      },
    ] as CustomHtmlElement[],
    standards: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content: "This program is missing required standards.",
          },
        ],
      },
    ] as CustomHtmlElement[],
  },
  tableHeader: "Mock table header",
  emptyDashboardText: "No entities found",
  enterEntityDetailsButtonText: "Mock Enter Button Text",
};

export const mockModalDrawerReportPageJson = {
  name: "mock-route-2b",
  path: "/mock/mock-route-2b",
  pageType: "modalDrawer",
  entityType: "accessMeasures",
  verbiage: mockModalDrawerReportPageVerbiage,
  modalForm: mockModalForm,
  drawerForm: mockDrawerForm,
};

export const mockModalOverlayReportPageJson = {
  name: "mock-route-2c",
  path: "/mock/mock-route-2c",
  pageType: "modalOverlay",
  entityType: "program",
  verbiage: mockModalOverlayReportPageVerbiage,
  modalForm: mockModalOverlayForm,
  overlayForm: mockModalOverlayForm,
};

export const mockModalOverlayReportPageWithOverlayJson = {
  name: "mock-route-2c",
  path: "/mock/mock-route-2c",
  pageType: "modalOverlay",
  entityType: "program",
  verbiage: mockModalOverlayReportPageVerbiage,
  modalForm: mockModalOverlayForm,
  overlayForm: mockModalOverlayForm,
};

export const mockOverlayReportPageJson: OverlayReportPageShape = {
  name: "mock-route-2d",
  path: "/mock/mock-route-2d",
  pageType: "modalOverlay",
  entityType: "plans",
  verbiage: mockOverlayReportPageVerbiage,
  details: {
    verbiage: {
      intro: {
        section: "",
        subsection: "Mock Details: Example Plan",
      },
      backButton: "Return to dashboard",
    },
    forms: [
      {
        form: {
          id: "mockMultiform",
          fields: [
            {
              id: "mockMultiform_assurance",
              type: "radio",
              validation: "radio",
              props: {
                choices: [
                  {
                    id: "yes",
                    label: "Mock Yes",
                  },
                  {
                    id: "no",
                    label:
                      "No, the plan does not comply on all standards based on all analyses and/or exceptions granted",
                  },
                ],
              },
            },
          ],
        },
        table: {
          bodyRows: [["", "Mock Cell", ""]],
          caption: "",
          headRow: [
            { hiddenName: "Status" },
            "Mock table header",
            { hiddenName: "Action" },
          ],
        },
        verbiage: {
          accordion: {
            buttonLabel: "Mock Accordion",
            text: "",
          },
          intro: {
            section: "",
          },
          heading: "Mock heading",
          hint: "Mock hint",
        },
      },
    ],
  },
};

export const mockReviewSubmitPageJson = {
  name: "mock-route-3",
  path: "/mock/mock-review-and-submit",
  pageType: "reviewSubmit",
};
