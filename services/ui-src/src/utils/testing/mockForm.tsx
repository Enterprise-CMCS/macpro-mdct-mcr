import {
  nonCompliantLabels,
  planComplianceStandardExceptionsLabel,
} from "../../constants";
import {
  CustomHtmlElement,
  EntityType,
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

export const mockAdminForm = {
  id: "mock-form-id",
  editableByAdmins: true,
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
  alert: "Mock alert",
  hint: "Mock hint",
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
  entityType: EntityType.PLANS,
  verbiage: {
    intro: mockVerbiageIntro,
    dashboardTitle: "Mock dashboard title",
    drawerTitle: "Mock drawer title",
    editEntityButtonText: "Edit",
  },
  drawerForm: mockDrawerForm,
};

export const mockNestedReportPageJson = {
  name: "mock-route-2a",
  path: "/mock/mock-route-2a",
  pageType: "drawer",
  entityType: EntityType.PLANS,
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
  entityType: EntityType.ILOS,
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
  entityType: EntityType.ANALYSIS_METHODS,
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
        id: "analysis_applicable",
        props: {
          choices: [
            {
              id: "mock-choice-id-1",
              label: "mock label 1",
            },
            {
              id: "mock-choice-id-2",
              label: "mock label 2 No",
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
        id: "custom_analysis_method_name",
        type: "text",
        validation: "text",
        props: {
          label: "Analysis method",
        },
      },
      {
        id: "custom_analysis_method_description",
        type: "textarea",
        validation: "textarea",
        props: {
          label: "description",
        },
      },
      {
        id: "analysis_method_frequency",
        type: "radio",
        props: {
          label: "Frequency of analysis",
          choices: [
            { id: "option1", label: "Weekly" },
            { id: "option2", label: "Monthly" },
          ],
        },
      },
      {
        id: "analysis_method_applicable_plans",
        type: "checkbox",
        props: {
          label: "Plans utilizing this method",
          choices: [{ label: "Plan 1" }],
        },
      },
    ],
  },
};

export const mockTestNaaarAnalysisMethodsPageJson = {
  name: "mock-route",
  path: "/naaar/analysis-methods",
  pageType: "drawer",
  entityType: EntityType.ANALYSIS_METHODS,
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
        id: "analysis_applicable",
        props: {
          choices: [
            {
              id: "mock-choice-id-1",
              label: "mock label 1",
            },
            {
              id: "mock-choice-id-2",
              label: "mock label 2 No",
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
        id: "custom_analysis_method_name",
        type: "text",
        validation: "text",
        props: {
          label: "Analysis method",
        },
      },
      {
        id: "custom_analysis_method_description",
        type: "textarea",
        validation: "textarea",
        props: {
          label: "description",
        },
      },
      {
        id: "analysis_method_frequency",
        type: "radio",
        props: {
          label: "Frequency of analysis",
          choices: [
            { id: "option1", label: "Weekly" },
            { id: "option2", label: "Monthly" },
          ],
        },
      },
      {
        id: "analysis_method_applicable_plans",
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
  entityType: EntityType.STANDARDS,
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
        id: "standards-mock-field-id-1",
        type: "text",
        validation: "text",
        props: {
          label: "mock field 1 label",
          hint: "mock field 1 hint",
        },
      },
      {
        id: "standards-mock-field-id-2",
        type: "radio",
        validation: "radio",
        props: {
          choices: [
            {
              id: "standards-mock-choice-id-1-1",
              label: "mock field 2 label 1",
              children: [
                {
                  id: "standards-mock-child-1",
                  type: "radio",
                  validation: "radio",
                  props: {
                    choices: [
                      {
                        id: "standards-mock-child-1-choice-1",
                        label: "mock label 1",
                      },
                      {
                        id: "standards-mock-child-1-choice-2",
                        label: "mock label 2",
                      },
                    ],
                  },
                },
                {
                  id: "standards-mock-child-2",
                  type: "radio",
                  validation: "radio",
                  props: {
                    choices: [
                      {
                        id: "standards-mock-child-2-choice-1",
                        label: "mock label 1",
                      },
                      {
                        id: "standards-mock-child-2-choice-2",
                        label: "mock label 2",
                      },
                    ],
                  },
                },
                {
                  id: "standards-mock-child-3",
                  type: "radio",
                  validation: "radio",
                  props: {
                    choices: [
                      {
                        id: "standards-mock-child-3-choice-1",
                        label: "mock label 1",
                      },
                      {
                        id: "standards-mock-child-3-choice-2",
                        label: "mock label 2",
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "standards-mock-choice-id-1-2",
              label: "mock field 2 label 2",
              children: [
                {
                  id: "standards-mock-child-4",
                  type: "radio",
                  validation: "radio",
                  props: {
                    choices: [
                      {
                        id: "standards-mock-child-4-choice-1",
                        label: "mock label 1",
                      },
                      {
                        id: "standards-mock-child-4-choice-2",
                        label: "mock label 2",
                      },
                    ],
                  },
                },
                {
                  id: "standards-mock-child-5",
                  type: "radio",
                  validation: "radio",
                  props: {
                    choices: [
                      {
                        id: "standards-mock-child-5-choice-1",
                        label: "mock label 1",
                      },
                      {
                        id: "standards-mock-child-5-choice-2",
                        label: "mock label 2",
                      },
                    ],
                  },
                },
                {
                  id: "standards-mock-child-6",
                  type: "radio",
                  validation: "radio",
                  props: {
                    choices: [
                      {
                        id: "standards-mock-child-6-choice-1",
                        label: "mock label 1",
                      },
                      {
                        id: "standards-mock-child-6-choice-2",
                        label: "mock label 2",
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

export const mockNaaarPlanCompliancePageJson = {
  name: "mock-route",
  path: "/naaar/plan-compliance",
  pageType: "planOverlay",
  entityType: EntityType.PLANS,
  verbiage: {
    intro: mockVerbiageIntro,
    requiredMessages: {
      plans: [
        {
          type: "p",
          content: "plans are required",
        },
      ],
      standards: [
        {
          type: "p",
          content: "standards are required",
        },
      ],
    },
    tableHeader: "Plan Name",
    enterEntityDetailsButtonText: "Enter",
  },
  details: {
    verbiage: {
      intro: {
        section: "mock section",
      },
    },
    forms: [
      {
        form: {
          id: "planComplianceMockForm1",
          fields: [
            {
              id: "mockComplianceQuestion1",
              type: "radio",
              validation: "radio",
              props: {
                choices: [
                  {
                    id: "mockComplianceOption1",
                    label: "Yes, is compliant",
                  },
                  {
                    id: "mockComplianceOption2",
                    label: "No, is not compliant",
                  },
                ],
              },
            },
          ],
        },
        table: {
          bodyRows: [["Mock body row 1"]],
          caption: "",
          headRow: ["Mock head row 1"],
        },
        verbiage: {
          heading: "mock plan compliance heading 1",
          hint: "mock plan compliance hint 1",
          intro: {
            section: "",
          },
        },
      },
      {
        form: {
          id: "planComplianceMockForm2",
          fields: [
            {
              id: "mockComplianceQuestion2",
              type: "radio",
              validation: "radio",
              props: {
                choices: [
                  {
                    id: "mockComplianceOption1",
                    label: "Yes, is compliant",
                  },
                  {
                    id: "mockComplianceOption2",
                    label: "No, is not compliant",
                  },
                ],
              },
            },
          ],
        },
        table: {
          bodyRows: [["Mock body row 2"]],
          caption: "",
          headRow: ["Mock head row 2"],
        },
        verbiage: {
          heading: "mock plan compliance heading 2",
          hint: "mock plan compliance hint 2",
          intro: {
            section: "",
          },
        },
      },
    ],
    childForms: [
      {
        parentForm: "mockParentFormId1",
        form: {
          id: "mockChildFormId1",
          fields: [
            {
              id: "mockChildFormFieldId1",
              type: "textarea",
              validation: "text",
            },
          ],
        },
      },
      {
        parentForm: "mockParentFormId2",
        form: {
          id: "mockChildFormId2",
          fields: [
            {
              id: "mockChildFormFieldId1",
              type: "textarea",
              validation: "text",
            },
          ],
        },
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
  drawerTitle: "{{action}} Mock drawer title",
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
  enterReportText: "Enter Details",
  editEntityButtonText: "Edit",
  enterEntityDetailsButtonText: "Mock Enter Button Text",
};

export const mockModalDrawerReportPageJson = {
  name: "mock-route-2b",
  path: "/mock/mock-route-2b",
  pageType: "modalDrawer",
  entityType: EntityType.ACCESS_MEASURES,
  verbiage: mockModalDrawerReportPageVerbiage,
  modalForm: mockModalForm,
  drawerForm: mockDrawerForm,
};

export const mockModalOverlayReportPageJson = {
  name: "mock-route-2c",
  path: "/mock/mock-route-2c",
  pageType: "modalOverlay",
  entityType: EntityType.PROGRAM,
  verbiage: mockModalOverlayReportPageVerbiage,
  modalForm: mockModalOverlayForm,
  overlayForm: mockModalOverlayForm,
};

export const mockModalOverlayReportPageWithOverlayJson = {
  name: "mock-route-2c",
  path: "/mock/mock-route-2c",
  pageType: "modalOverlay",
  entityType: EntityType.PROGRAM,
  verbiage: mockModalOverlayReportPageVerbiage,
  modalForm: mockModalOverlayForm,
  overlayForm: mockModalOverlayForm,
};

export const mockOverlayReportPageJson: OverlayReportPageShape = {
  name: "mock-route-2d",
  path: "/mock/mock-route-2d",
  pageType: "modalOverlay",
  entityType: EntityType.PLANS,
  verbiage: mockOverlayReportPageVerbiage,
  details: {
    verbiage: {
      intro: {
        section: "",
        subsection: "Mock Details: Example Plan",
      },
      backButton: "Mock Back Button: Main",
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
                    label: nonCompliantLabels["438.206"],
                  },
                ],
              },
            },
          ],
        },
        table: {
          bodyRows: [["", "Mock Cell", ""]],
          caption: "Mock Table",
          headRow: [
            { hiddenName: "Status" },
            "Mock Table Header",
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
            subsection: "Mock Section",
          },
          heading: "Mock Heading",
          hint: "Mock Hint",
        },
      },
    ],
    childForms: [
      {
        parentForm: "mockMultiform",
        verbiage: {
          intro: {
            section: "",
            subsection: "Mock Child Form",
          },
          backButton: "Mock Back Button: Child",
        },
        form: {
          id: "mockMultiform_childForm",
          fields: [
            {
              id: "mockMultiform_mockInput",
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
                    label: "Mock No",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
};

export const mockEntityDetailsMultiformOverlayJson: OverlayReportPageShape = {
  ...mockOverlayReportPageJson,
  details: {
    verbiage: mockOverlayReportPageJson.details!.verbiage,
    forms: [
      ...mockOverlayReportPageJson.details!.forms,
      {
        form: {
          id: "mockMultiformWithTable",
          fields: [
            {
              id: "mockMultiformWithTable_assurance",
              type: "radio",
              validation: "radio",
              props: {
                choices: [
                  {
                    id: "yes",
                    label: "Mock Yes 2",
                  },
                  {
                    id: "no",
                    label: nonCompliantLabels["438.206"],
                  },
                ],
              },
            },
          ],
        },
        table: {
          bodyRows: [["", "Mock Cell 2", ""]],
          caption: "Mock Table 2",
          headRow: [
            { hiddenName: "Status" },
            "Mock Table Header 2",
            { hiddenName: "Action" },
          ],
        },
        verbiage: {
          accordion: {
            buttonLabel: "Mock Accordion 2",
            text: "",
          },
          backButton: "Mock Back Button: Form 2",
          intro: {
            section: "",
            subsection: "Mock Details: Form 2",
          },
          heading: "Mock Heading 2",
          hint: "Mock Hint 2",
        },
      },
    ],
    childForms: [
      ...mockOverlayReportPageJson.details!.childForms!,
      {
        parentForm: "mockMultiformWithTable",
        verbiage: {
          intro: {
            section: "",
          },
          backButton: "Mock Back Button: Form",
        },
        table: {
          caption: "Mock Child Table",
          sortableHeadRow: {
            id: { header: "ID" },
            exceptionsNonCompliance: { header: "Mock N/E" },
            standardType: { header: "Mock Standard Type Header" },
            actions: { header: "Actions", hidden: true },
          },
          verbiage: {
            backButton: "Mock Back Button: Table",
            intro: {
              section: "",
              subsection: "Mock Details: Child Table",
            },
          },
        },
        form: {
          id: "mockMultiformWithTable_childForm",
          fields: [
            {
              id: "planCompliance43868_standard-mockStandard",
              type: "radio",
              validation: "radioOptional",
              props: {
                choices: [
                  {
                    id: "yes",
                    label: "Mock Yes",
                    children: [
                      {
                        id: "mock-Description",
                        type: "textarea",
                        validation: "textOptional",
                      },
                      {
                        id: "planCompliance43868_standard-mockStandard-nonComplianceAnalyses",
                        type: "checkbox",
                        validation: "checkboxOneOptional",
                        props: {
                          label:
                            "Mock Plan deficiencies: analyses used to identify deficiencies",
                          choices: [],
                        },
                      },
                    ],
                  },
                  {
                    id: "no",
                    label: planComplianceStandardExceptionsLabel,
                  },
                ],
              },
            },
            {
              id: "planCompliance43868_standard-mockStandard-exceptionsDescription",
              type: "textarea",
              validation: "textOptional",
              props: {
                label: "Mock Exception Description",
              },
            },
            {
              id: "planCompliance43868_standard-mockStandard-nonComplianceDescription",
              type: "textarea",
              validation: "textOptional",
              props: {
                label: "Mock Non-Compliance Description",
              },
            },
          ],
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
