export const form = {
  id: "adminBannerForm",
  options: {
    mode: "onChange",
  },
  fields: [
    {
      id: "abf-title",
      type: "text",
      props: {
        label: "Title text",
        placeholder: "New banner title",
      },
      validation: {
        type: "string",
        options: { required: true },
        errorMessages: {
          required: "Title text is required",
        },
      },
    },
    {
      id: "abf-description",
      type: "textarea",
      props: {
        label: "Description text",
        placeholder: "New banner description",
      },
      validation: {
        type: "string",
        options: { required: true },
        errorMessages: {
          required: "Description text is required",
        },
      },
    },
    {
      id: "abf-link",
      type: "text",
      props: {
        label: "Link",
        requirementLabel: "Optional",
      },
      validation: {
        type: "string",
        options: {
          format: "url",
        },
        errorMessages: {
          format: "URL must be valid",
        },
      },
    },
    {
      id: "abf-startDate",
      type: "datesplit",
      props: {
        label: "Start date",
        hint: "mm/dd/yyyy (12:00:00am)",
      },
      validation: {
        type: "string",
        options: {
          required: true,
          matches: "^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]",
        },
        errorMessages: {
          required: "Start date is required",
          matches: "Must be a valid date",
        },
      },
    },
    {
      id: "abf-endDate",
      type: "datesplit",
      props: {
        label: "End date",
        hint: "mm/dd/yyyy (11:59:59pm)",
      },
      validation: {
        type: "string",
        options: {
          required: true,
          matches: "^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]",
          // TODO: add minimum start date reference min: "startDate"
        },
        errorMessages: {
          required: "End date is required",
          matches: "Must be a valid date",
        },
      },
    },
  ],
};
