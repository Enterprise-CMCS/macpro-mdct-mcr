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
      type: "date",
      name: "abf-startDate",
      props: {
        label: "Start date",
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
      id: "abf-endDate",
      type: "date",
      props: {
        label: "End date",
      },
      validation: {
        type: "number",
        options: {
          required: true,
          min: "abf-startDate",
        },
        errorMessages: {
          required: "End date is required",
          format: "Invalid end date",
          min: "End date cannot be before start date",
        },
      },
    },
  ],
};
