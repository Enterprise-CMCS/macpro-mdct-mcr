export const form = {
  options: {
    mode: "onChange",
  },
  fields: [
    {
      type: "text",
      id: "title",
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
      type: "textarea",
      id: "description",
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
      type: "text",
      id: "link",
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
      type: "datesplit",
      id: "startDate",
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
      type: "child",
      id: "startDateYear",
      validation: {
        type: "number",
        options: {
          required: true,
          min: 2022,
        },
      },
    },
    {
      type: "child",
      id: "startDateMonth",
      validation: {
        type: "number",
        options: {
          required: true,
          max: 12,
        },
      },
    },
    {
      type: "child",
      id: "startDateDay",
      validation: {
        type: "number",
        options: {
          required: true,
          max: 31,
        },
      },
    },
    {
      type: "datesplit",
      id: "endDate",
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
      type: "child",
      id: "endDateYear",
      validation: {
        type: "number",
        options: {
          required: true,
          min: 2022,
        },
      },
    },
    {
      type: "child",
      id: "endDateMonth",
      validation: {
        type: "number",
        options: {
          required: true,
          max: 12,
        },
      },
    },
    {
      type: "child",
      id: "endDateDay",
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
