import { FormJson, ReportFormFieldType, ValidationType } from "types";

export const adminFormJson: FormJson = {
  id: "addAdminBanner",
  editableByAdmins: true,
  options: {
    mode: "onChange",
  },
  fields: [
    {
      id: "bannerTitle",
      type: ReportFormFieldType.TEXT,
      validation: ValidationType.TEXT,
      props: {
        label: "Title text",
        placeholder: "New banner title",
      },
    },
    {
      id: "bannerDescription",
      type: ReportFormFieldType.TEXTAREA,
      validation: ValidationType.TEXT,
      props: {
        label: "Description text",
        hint: [
          {
            type: "span",
            content: "Formatting is supported with these HTML tags:",
          },
          {
            type: "span",
            props: {
              style: {
                display: "block",
                paddingLeft: "1rem",
              },
            },
            children: [
              {
                type: "span",
                content: "&lt;strong&gt;",
                props: {
                  className: "fake-list-item",
                },
              },
              {
                type: "span",
                content: "&lt;b&gt;",
                props: {
                  className: "fake-list-item",
                },
              },
              {
                type: "span",
                content: "&lt;em&gt;",
                props: {
                  className: "fake-list-item",
                },
              },
              {
                type: "span",
                content: "&lt;i&gt;",
                props: {
                  className: "fake-list-item",
                },
              },
              {
                type: "span",
                content: "&lt;p&gt;",
                props: {
                  className: "fake-list-item",
                },
              },
              {
                type: "span",
                content: "&lt;ul&gt;",
                props: {
                  className: "fake-list-item",
                },
              },
              {
                type: "span",
                content: "&lt;ol&gt;",
                props: {
                  className: "fake-list-item",
                },
              },
              {
                type: "span",
                content: "&lt;li&gt;",
                props: {
                  className: "fake-list-item",
                },
              },
              {
                type: "span",
                content: "&lt;a&gt;",
                props: {
                  className: "fake-list-item",
                },
              },
            ],
          },
        ],
        placeholder: "New banner description",
      },
    },
    {
      id: "bannerLink",
      type: ReportFormFieldType.TEXT,
      validation: ValidationType.URL_OPTIONAL,
      props: {
        label: "Link",
        styleAsOptional: true,
      },
    },
    {
      id: "bannerStartDate",
      type: ReportFormFieldType.DATE,
      validation: ValidationType.DATE,
      props: {
        label: "Start date",
      },
    },
    {
      id: "bannerEndDate",
      type: ReportFormFieldType.DATE,
      validation: {
        type: ValidationType.END_DATE,
        dependentFieldName: "bannerStartDate",
      },
      props: {
        label: "End date",
      },
    },
  ],
};
