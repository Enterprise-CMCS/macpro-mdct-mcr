import * as yup from "yup";
// utils
import { makeFormSchema } from "../../utils/forms/forms";

const formFields = {
  fields: [
    {
      type: "text",
      id: "title",
      props: {
        name: "title",
        label: "Title text",
        placeholder: "New banner title",
      },
      validation: yup.string().required("Title text is required"),
    },
    {
      type: "textarea",
      id: "description",
      props: {
        name: "description",
        label: "Description text",
        placeholder: "New banner description",
      },
      validation: yup.string().required("Description text is required"),
    },
    {
      type: "text",
      id: "link",
      props: {
        name: "link",
        label: "Link",
        requirementLabel: "Optional",
      },
      validation: yup.string().url("URL must be valid"),
    },
    {
      type: "datesplit",
      id: "startDate",
      props: {
        name: "startDate",
        label: "Start date",
        hint: "mm/dd/yyyy (12:00:00am)",
      },
      validation: yup.number().required("Valid start date is required"),
    },
    {
      type: "child",
      id: "startDateYear",
      validation: yup.number().required().min(2022),
    },
    {
      type: "child",
      id: "startDateMonth",
      validation: yup.number().required().max(12),
    },
    {
      type: "child",
      id: "startDateDay",
      validation: yup.number().required().max(31),
    },
    {
      type: "datesplit",
      id: "endDate",
      props: {
        name: "endDate",
        label: "End date",
        requirementLabel: "mm/dd/yyyy (11:59:59pm)",
      },
      validation: yup
        .number()
        .required("Valid end date is required")
        .min(yup.ref("startDate"), "End date cannot be before start date"),
    },
    {
      type: "child",
      id: "endDateYear",
      validation: yup.number().required().min(2022),
    },
    {
      type: "child",
      id: "endDateMonth",
      validation: yup.number().required().max(12),
    },
    {
      type: "child",
      id: "endDateDay",
      validation: yup.number().required().max(31),
    },
  ],
};

const formSchema = { schema: makeFormSchema(formFields.fields) };

export const form = {
  options: {
    mode: "onChange",
  },
  ...formSchema,
  ...formFields,
};
