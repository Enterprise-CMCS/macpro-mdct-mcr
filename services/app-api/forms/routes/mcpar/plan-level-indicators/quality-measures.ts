import {
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
  ModalDrawerRoute,
} from "../../../../utils/types";

export const qualityMeasuresRoute: ModalDrawerRoute = {
  name: "VII: Quality Measures",
  path: "/mcpar/plan-level-indicators/quality-measures",
  pageType: PageTypes.MODAL_DRAWER,
  entityType: EntityType.QUALITY_MEASURES,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic VII: Quality & Performance Measures",
      spreadsheet: "D2_Plan_Measures",
      info: [
        {
          type: "p",
          content:
            "Report on individual measures in each of the following eight domains: (1) Primary care access and preventive care, (2) Maternal and perinatal health, (3) Care of acute and chronic conditions, (4) Behavioral health care, (5) Dental and oral health services, (6) Health plan enrollee experience of care, (7) Long-term services and supports, and (8) Other. For composite measures, be sure to include each individual sub-measure component.",
        },
      ],
    },
    dashboardTitle: "Quality & performance measure total count:",
    countEntitiesInTitle: true,
    addEntityButtonText: "Add quality & performance measure",
    missingReportingPeriodMessage:
      "Add the Measure Reporting Period for this quality and performance measure by editing the measure.",
    editEntityButtonText: "Edit measure",
    addEditModalAddTitle: "Add a quality & performance measure",
    addEditModalEditTitle: "Edit quality & performance measure",
    addEditModalMessage:
      "Complete the remaining indicators for this measure by saving the measure and selecting “Enter measure results”.",
    deleteEntityButtonAltText: "Delete quality & performance measure",
    deleteModalTitle: "Delete quality measure?",
    deleteModalConfirmButtonText: "Yes, delete measure",
    deleteModalWarning:
      "You will lose all information entered for this measure. Are you sure you want to proceed?",
    entityMissingResponseMessage:
      "Missing measure results for one or more plans.",
    entityEmptyResponseMessage: "Error: no results entered",
    entityUnfinishedMessage:
      "Add the plan-level details for this quality and performance measure by entering measure results.",
    enterEntityDetailsButtonText: "Enter measure results",
    editEntityDetailsButtonText: "Edit measure results",
    drawerEyebrowTitle: "D2.VII.9a and D2.VII.9b",
    drawerTitle: "{{action}} plan-level measure results",
    drawerNoFormMessage:
      "No plans added. To enter measure results, add all plans in A: Program Information - Add plans.",
  },
  modalForm: {
    id: "dqm-modal",
    fields: [
      {
        id: "qualityMeasure_name",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "D2.VII.2 Measure name",
          hint: "What is the measure name?",
        },
      },
      {
        id: "qualityMeasure_nqfNumber",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "D2.VII.3 National Quality Forum (NQF) number",
          hint: "What is the NQF number?",
        },
      },
      {
        id: "qualityMeasure_reportingRateType",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D2.VII.4 Measure reporting",
          hint: "Is measure reporting program-specific or cross-program? Select one.",
          choices: [
            {
              id: "lTIN7GiY2Ui2kJYrWzXqVw",
              label: "Program-specific rate",
            },
            {
              id: "f58wKTe5tUGREFYDPnWRmg",
              label: "Cross-program rate",
              children: [
                {
                  id: "qualityMeasure_crossProgramReportingRateProgramList",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "qualityMeasure_reportingRateType",
                  },
                  props: {
                    label: "D2.VII.5 Measure reporting: List programs",
                    hint: "What are the programs? Separate program names with a comma.",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "qualityMeasure_set",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D2.VII.6 Measure set",
          hint: "What is the measure set? Select one.",
          choices: [
            {
              id: "tjSQLCDhgEy7H3VrhtUKxw",
              label: "Medicaid Child Core Set",
            },
            {
              id: "XiXT7XWal0eko87XIgLpSg",
              label: "Medicaid Adult Core Set",
            },
            {
              id: "beUZv1nYf0GA2JnGi5S8SQ",
              label: "State-specific",
            },
            {
              id: "UFJDtz8jIUanZRXPqAUMCg",
              label: "HEDIS",
            },
            {
              id: "70AlIcEQgEOofv0fqGqLpA",
              label: "Other, specify",
              children: [
                {
                  id: "qualityMeasure_set-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "qualityMeasure_set",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "qualityMeasure_reportingPeriod",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D2.VII.7a Reporting period",
          hint: "Is the reporting period the same as what is requested in this report? Select yes or no.",
          choices: [
            {
              id: "XAalDWT7l0qPz676XFGSGQ",
              label: "Yes",
            },
            {
              id: "keBGGlGpNkqkplwaviRuiA",
              label: "No",
              children: [
                {
                  id: "qualityMeasure_reportingPeriodStartDate",
                  type: ReportFormFieldType.DATE,
                  validation: {
                    type: ValidationType.DATE,
                    nested: true,
                    parentFieldName: "qualityMeasure_reportingPeriod",
                  },
                  props: {
                    label: "D2.VII.7b Reporting period: Date range",
                    hint: "What is the reporting period covered by the measure?<br><br>Start date",
                    timetype: "startDate",
                  },
                },
                {
                  id: "qualityMeasure_reportingPeriodEndDate",
                  type: ReportFormFieldType.DATE,
                  validation: {
                    type: ValidationType.END_DATE,
                    dependentFieldName:
                      "qualityMeasure_reportingPeriodStartDate",
                    nested: true,
                    parentFieldName: "qualityMeasure_reportingPeriod",
                  },
                  props: {
                    hint: "End date",
                    timetype: "endDate",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "qualityMeasure_description",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "D2.VII.8 Measure description",
          hint: "For measures that are not part of standardized national measure sets (i.e. state-specific measures), states should provide a description of the measure (for example, numerator and denominator).",
        },
      },
    ],
  },
  drawerForm: {
    id: "dqm-drawer",
    fields: [
      {
        id: "qualityMeasure_plan_measureResults",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        repeat: "plans",
        props: {
          label: ": Measure Results",
          hint: "What are the measure results or values for this plan? Add free text or enter “N/A” if not applicable.",
        },
      },
    ],
  },
};
