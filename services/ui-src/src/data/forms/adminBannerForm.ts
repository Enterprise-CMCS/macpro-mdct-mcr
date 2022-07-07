export const form = {
  id: "adminBannerForm",
  options: {
    mode: "onChange",
  },
  fields: [
    {
      id: "title",
      type: "text",
      props: {
        name: "title",
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
      id: "description",
      type: "textarea",
      props: {
        name: "description",
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
      id: "link",
      type: "text",
      props: {
        name: "link",
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
      id: "startDate",
      type: "datesplit",
      props: {
        name: "startDate",
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
      id: "startDateYear",
      type: "child",
      validation: {
        type: "number",
        options: {
          required: true,
          min: 2022,
        },
      },
    },
    {
      id: "startDateMonth",
      type: "child",
      validation: {
        type: "number",
        options: {
          required: true,
          max: 12,
        },
      },
    },
    {
      id: "startDateDay",
      type: "child",
      validation: {
        type: "number",
        options: {
          required: true,
          max: 31,
        },
      },
    },
    {
      id: "endDate",
      type: "datesplit",
      props: {
        name: "endDate",
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
      id: "endDateYear",
      type: "child",
      validation: {
        type: "number",
        options: {
          required: true,
          min: 2022,
        },
      },
    },
    {
      id: "endDateMonth",
      type: "child",
      validation: {
        type: "number",
        options: {
          required: true,
          max: 12,
        },
      },
    },
    {
      id: "endDateDay",
      type: "child",
      validation: {
        type: "number",
        options: {
          required: true,
          max: 31,
        },
      },
    },
  ],
};
