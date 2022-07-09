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
        name: "abf-title",
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
        name: "abf-description",
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
        name: "abf-link",
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
        name: "abf-startDate",
        label: "Start date",
        hint: "mm/dd/yyyy (12:00:00am)",
      },
      validation: {
        type: "number",
        options: {
          required: true,
        },
        errorMessages: {
          required: "Start date is required",
          format: "Invalid start date",
        },
      },
    },
    {
      id: "abf-startDateMonth",
      type: "child",
      props: null,
      validation: {
        type: "number",
        options: {
          required: true,
          max: 12,
        },
      },
    },
    {
      id: "abf-startDateDay",
      type: "child",
      props: null,
      validation: {
        type: "number",
        options: {
          required: true,
          max: 31,
        },
      },
    },
    {
      id: "abf-startDateYear",
      type: "child",
      props: null,
      validation: {
        type: "number",
        options: {
          required: true,
          min: 2022,
        },
      },
    },
    {
      id: "abf-endDate",
      type: "datesplit",
      props: {
        name: "abf-endDate",
        label: "End date",
        hint: "mm/dd/yyyy (11:59:59pm)",
      },
      validation: {
        type: "number",
        options: {
          required: true,
          // TODO: add minimum start date reference min: "startDate"
        },
        errorMessages: {
          required: "End date is required",
          format: "Invalid end date",
          min: "End date cannot be before start date",
        },
      },
    },
    {
      id: "abf-endDateMonth",
      type: "child",
      props: null,
      validation: {
        type: "number",
        options: {
          required: true,
          max: 12,
        },
      },
    },
    {
      id: "abf-endDateDay",
      type: "child",
      props: null,
      validation: {
        type: "number",
        options: {
          required: true,
          max: 31,
        },
      },
    },
    {
      id: "abf-endDateYear",
      type: "child",
      props: null,
      validation: {
        type: "number",
        options: {
          required: true,
          min: 2022,
        },
      },
    },
  ],
};
