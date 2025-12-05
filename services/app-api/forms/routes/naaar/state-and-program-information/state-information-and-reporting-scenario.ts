import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const stateInformationAndReportingScenarioRoute: FormRoute = {
  name: "A. State information and reporting scenario",
  path: "/naaar/state-and-program-information/state-information-and-reporting-scenario",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "I. State and program information",
      subsection: "A. State information and reporting scenario",
      info: [
        {
          type: "p",
          content:
            "Who should CMS contact with questions regarding information reported in the NAAAR? Follow-on communications related to this report will be made to the primary contact.",
        },
        {
          type: "p",
          content:
            "Use this section to report your contact information, date of report submission, and reporting scenario.",
        },
      ],
    },
    praDisclosure: [
      {
        type: "p",
        content: "<strong>PRA Disclosure Statement</strong>",
      },
      {
        type: "p",
        content:
          "According to the Paperwork Reduction Act of 1995, no persons are required to respond to a collection of information unless it displays a valid OMB control number. The valid OMB control number for this information collection is 0938-0920 (Expires: June 30, 2026). The time required to complete this information collection is estimated to average 6 hours per response, including the time to review instructions, search existing data resources, gather the data needed, and complete and review the information collection. If you have comments concerning the accuracy of the time estimate(s) or suggestions for improving this form, please write to: CMS, 7500 Security Boulevard, Attn: PRA Reports Clearance Officer, Mail Stop C4-26-05, Baltimore, Maryland 21244-1850",
      },
    ],
  },
  form: {
    id: "isiars",
    fields: [
      {
        id: "contactName",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "I.A.1 Contact name",
          hint: "First and last name of the contact person.",
        },
      },
      {
        id: "contactEmailAddress",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.EMAIL,
        props: {
          label: "I.A.2 Contact email address",
          hint: "Enter email address. Department or program-wide email addresses are permitted.",
        },
      },
      {
        id: "stateName",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "I.A.3 State or territory",
          hint: "Auto-populates from your account profile.",
          disabled: true,
        },
      },
      {
        id: "reportSubmissionDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "I.A.4 Date of report submission",
          hint: "CMS receives this date upon submission of this report.",
          disabled: true,
        },
      },
      {
        id: "reportingScenario",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "I.A.5 Reporting scenario",
          hint: [
            {
              type: "span",
              content:
                "Enter the scenario under which the state is submitting this form to CMS. Under 42 C.F.R. § 438.207(c) - (d), the state must submit an assurance of compliance after reviewing documentation submitted by a plan under the following three scenarios:",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "Scenario 1: At the time the plan enters into a contract with the state;",
              props: {
                className: "fake-list-item",
              },
            },
            {
              type: "span",
              content: "Scenario 2: On an annual basis;",
              props: {
                className: "fake-list-item",
              },
            },
            {
              type: "span",
              content:
                "Scenario 3: Any time there has been a significant change (as defined by the state) in the plan’s operations that would affect its adequacy of capacity and services, including (1) changes in the plan’s services, benefits, geographic service area, composition of or payments to its provider network, or (2) enrollment of a new population in the plan.",
              props: {
                className: "fake-list-item",
              },
            },
            {
              type: "span",
              content:
                "States should complete one (1) form with information for applicable managed care plans and programs. For example, if the state submits this form under scenario 1 above, the state should submit this form only for the managed care plan (and the applicable managed care program) that entered into a new contract with the state. The state should not report on any other plans or programs under this scenario. As another example, if the state submits this form under scenario 2, the state should submit this form for all managed care plans and managed care programs.",
              props: {
                className: "fake-paragraph-break",
              },
            },
          ],

          choices: [
            {
              id: "g3B64XNZhZCZ017er2Y6hJ",
              label: "Scenario 1: New contract",
            },
            {
              id: "mlvX4umhgnU199rPmMJybc",
              label: "Scenario 2: Annual report",
            },
            {
              id: "l7XDjKKDrwryEe5YgDTTmP",
              label: "Scenario 3: Significant change",
              children: [
                {
                  id: "reportingScenario_significantChange",
                  type: ReportFormFieldType.CHECKBOX,
                  validation: {
                    type: ValidationType.CHECKBOX,
                    nested: true,
                    parentFieldName: "reportingScenario",
                    parentOptionId: "l7XDjKKDrwryEe5YgDTTmP",
                  },
                  props: {
                    hint: "Select all that apply to the significant change.",
                    choices: [
                      {
                        id: "vCV6gRjj2pbYTcsWhaJsy1",
                        label: "Services",
                      },
                      {
                        id: "3swTHronFtgFRzyL9ETh3F",
                        label: "Benefits",
                      },
                      {
                        id: "uTTqmN029vDhFMrnbe5ru9",
                        label: "Geographic service area",
                      },
                      {
                        id: "aSxQ1M0UXU8dTQvFSqrBYF",
                        label: "Composition of provider network",
                      },
                      {
                        id: "UR5cBIBBuPPDzKAhJ3lpSZ",
                        label: "Payments to provider network",
                      },
                      {
                        id: "WoqwKvq0cJpfkDE3e3f1Jj",
                        label: "Enrollment of new population",
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "IyPRlUA4k3bTkj5rF1E8zg",
              label: "Other, specify",
              children: [
                {
                  id: "reportingScenario-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "reportingScenario",
                  },
                  props: {
                    label: "1.A.6 Reporting scenario - other ",
                    hint: "If the state is submitting this form to CMS for any reason other than those specified in I.A.5, explain the reason.",
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
