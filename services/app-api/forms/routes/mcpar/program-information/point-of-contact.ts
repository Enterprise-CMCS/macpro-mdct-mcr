import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const pointOfContactRoute: FormRoute = {
  name: "Point of Contact",
  path: "/mcpar/program-information/point-of-contact",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section A: Program Information",
      subsection: "Point of Contact",
      spreadsheet: "A_Program_Info",
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
    id: "apoc",
    fields: [
      {
        id: "stateName",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "A.1 State name",
          hint: "Auto-populated from your account profile.",
          disabled: true,
        },
      },
      {
        id: "contactName",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "A.2a Contact name",
          hint: "First and last name of the contact person. <br/> States that do not wish to list a specific individual on the report are encouraged to use a department or program-wide email address that will allow anyone with questions to quickly reach someone who can provide answers.",
        },
      },
      {
        id: "contactEmailAddress",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.EMAIL,
        props: {
          label: "A.2b Contact email address",
          hint: "Enter email address. Department or program-wide email addresses ok.",
        },
      },
      {
        id: "submitterName",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "A.3a Submitter name",
          hint: "CMS receives this data upon submission of this MCPAR report.",
          disabled: true,
        },
      },
      {
        id: "submitterEmailAddress",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.EMAIL_OPTIONAL,
        props: {
          label: "A.3b Submitter email address",
          hint: "CMS receives this data upon submission of this MCPAR report.",
          disabled: true,
        },
      },
      {
        id: "reportSubmissionDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "A.4 Date of report submission",
          hint: "CMS receives this date upon submission of this MCPAR report.",
          disabled: true,
        },
      },
    ],
  },
};
