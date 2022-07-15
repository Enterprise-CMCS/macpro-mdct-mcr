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
      props: {
        label: "Start date",
      },
      validation: {
        type: "string",
        options: {
          required: true,
          regex: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
        },
        errorMessages: {
          required: "Start date is required",
          regex:
            "Please ensure your format is in MM/DD/YYYY and is a real date",
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
        type: "string",
        options: {
          required: true,
          regex: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
          // TODO: add minimum start date reference min: "startDate"
        },
        errorMessages: {
          required: "End date is required",
          regex:
            "Please ensure your format is in MM/DD/YYYY and is a real date",
        },
      },
    },
  ],
};
