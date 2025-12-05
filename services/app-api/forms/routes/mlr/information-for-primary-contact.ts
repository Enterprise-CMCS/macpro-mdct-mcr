import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../utils/types";

export const informationForPrimaryContactRoute: FormRoute = {
  name: "Information for Primary Contact",
  path: "/mlr/information-for-primary-contact",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Program Information",
      subsection: "Information for Primary Contact",
      hint: "Please identify the individual whom CMS should contact with questions regarding the MLR report. Follow up communications related to this report will be made to the primary contact.",
      spreadsheet: "Program Information",
      exportSection: "Information for Primary Contact",
    },
    praDisclosure: [
      {
        type: "p",
        content: "<strong>PRA Disclosure Statement</strong>",
      },
      {
        type: "p",
        content:
          "According to the Paperwork Reduction Act of 1995, no persons are required to respond to a collection of information unless it displays a valid OMB control number. The valid OMB control number for this information collection is 0938-0920 (Expires: June 30, 2024). The time required to complete this information collection is estimated to average 6 hours per response, including the time to review instructions, search existing data resources, gather the data needed, and complete and review the information collection. If you have comments concerning the accuracy of the time estimate(s) or suggestions for improving this form, please write to: CMS, 7500 Security Boulevard, Attn: PRA Reports Clearance Officer, Mail Stop C4-26-05, Baltimore, Maryland 21244-1850",
      },
    ],
  },
  form: {
    id: "ipc",
    fields: [
      {
        id: "contactName",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "A. Contact name",
          hint: "Enter the first and last name of the primary contact for this report.",
        },
      },
      {
        id: "contactPhoneNumber",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "B. Contact phone",
          hint: "Enter phone number as ###-###-####.",
        },
      },
      {
        id: "contactEmailAddress",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.EMAIL,
        props: {
          label: "C. Contact email address",
          hint: "Enter email address of the primary contact.",
        },
      },
      {
        id: "contactJobTitle",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "D. Contact title",
          hint: "Enter the primary contact’s job title.",
        },
      },
      {
        id: "stateName",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "E. State",
          hint: "Auto-populates from your account profile.",
          disabled: true,
        },
      },
      {
        id: "stateAgencyName",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "F. State Agency Name",
          hint: "Enter the name of the state/territory Medicaid agency that is submitting this report.",
        },
      },
      {
        id: "versionControl",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "G. Version control",
          hint: "Is this report an updated version of a previously submitted summary MLR report covering the same time period? <br /> Auto-populates. Note: The version control field is determined from the submission status. All new MLR reports are initial submissions.",
          choices: [
            {
              id: "cyUSrTH8mWdpqAKExLZAkz",
              label: "Yes, this is a resubmission",
              children: [
                {
                  id: "versionControlDescription",
                  type: ReportFormFieldType.CHECKBOX,
                  validation: {
                    type: ValidationType.CHECKBOX,
                    nested: true,
                    parentFieldName: "versionControl",
                    parentOptionId: "cyUSrTH8mWdpqAKExLZAkz",
                  },
                  props: {
                    label: "H. Version control description",
                    hint: "Select the response(s) that best describes the changes between this version and the prior version of the annual summary MLR Report submission.",
                    choices: [
                      {
                        id: "nwq29k5JoRaUiz7CtBZFQN",
                        label: "Revise state contact information",
                      },
                      {
                        id: "BezTBrQf7t3bud7LaAMLqH",
                        label: "Revise program or plan information",
                      },
                      {
                        id: "Kr7HesM9jxDGfP4xDVAXpm",
                        label: "Revise amount(s) for MLR calculation",
                      },
                      {
                        id: "2tdWvZkAkozLqZie6iwXRh",
                        label: "Revise amount of remittance",
                      },
                      {
                        id: "3fbB2pqVnMAQjKtFVZoSXw",
                        label: "Revise member months",
                      },
                      {
                        id: "4V3X7Mmz6VC89k9bgQUoLK",
                        label: "Other, specify",
                        children: [
                          {
                            id: "versionControlDescription-otherText",
                            type: ReportFormFieldType.TEXTAREA,
                            validation: {
                              type: ReportFormFieldType.TEXT,
                              nested: true,
                              parentFieldName: "versionControlDescription",
                              parentOptionId: "4V3X7Mmz6VC89k9bgQUoLK",
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "KFCd3rfEu3eT4UFskUhDtx",
              label: "No, this is an initial submission",
            },
          ],
          disabled: true,
        },
      },
    ],
  },
};
