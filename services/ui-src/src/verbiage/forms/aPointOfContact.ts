export const pageJson = {
  intro: {
    section: "Section A: Program Information",
    subsection: "Point of Contact",
    info: "Who should CMS contact with questions regarding information reported in the MCPAR? States that do not wish to list a specific individual on the report are encouraged to use a department or program-wide email address that will allow anyone with questions to quickly reach someone who can provide answers.",
  },
  form: {
    id: "apointofcontact",
    options: {
      mode: "onChange",
    },
    fields: [
      {
        id: "apoc-a1",
        type: "text",
        props: {
          name: "apoc-a1",
          label: "A.1 State name",
          hint: "Auto-populated from your account profile.",
          disabled: true,
        },
        validation: null,
      },
      {
        id: "apoc-a2a",
        type: "text",
        props: {
          name: "apoc-a2a",
          label: "A.2a Contact name",
          hint: "First and last name of the contact person.",
        },
        validation: {
          type: "string",
          options: { required: true },
          errorMessages: {
            required: "Contact name is required",
          },
        },
      },
      {
        id: "apoc-a2b",
        type: "text",
        props: {
          name: "apoc-a2b",
          label: "A.2b Contact email address",
          hint: "Enter email address.",
        },
        validation: {
          type: "string",
          options: { required: true },
          errorMessages: {
            required: "Contact email address is required",
          },
        },
      },
      {
        id: "apoc-a3a",
        type: "text",
        props: {
          name: "apoc-a3a",
          label: "A.3a Submitter name",
          hint: "Auto-populated from your account profile. Correct if needed.",
        },
        validation: {
          type: "string",
          options: { required: true },
          errorMessages: {
            required: "Submitter name is required",
          },
        },
      },
      {
        id: "apoc-a3b",
        type: "text",
        props: {
          name: "apoc-a3b",
          label: "A.3b Submitter email address",
          hint: "Auto-populated from your account profile. Correct if needed.",
        },
        validation: {
          type: "string",
          options: { required: true },
          errorMessages: {
            required: "Submitter email address is required",
          },
        },
      },
      {
        id: "apoc-a4",
        type: "text",
        props: {
          name: "apoc-a4",
          label: "A.4 Date of report submission",
          hint: "CMS receives this date upon submission of this MCPAR report.",
          disabled: true,
        },
        validation: null,
      },
    ],
  },
};
