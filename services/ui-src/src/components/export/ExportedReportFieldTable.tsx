import { ReactElement } from "react";
// components
import { ExportedReportFieldRow, Table } from "components";
// types, utils
import {
  FieldChoice,
  FormField,
  StandardReportPageShape,
  DrawerReportPageShape,
} from "types";

export const ExportedReportFieldTable = ({ section }: Props) => {
  const pageType = section.pageType;
  const formFields =
    pageType === "drawer" ? section.drawerForm?.fields : section.form?.fields;
  const entityType = section.entityType;

  const formHasOnlyDynamicFields = formFields?.every(
    (field: FormField) => field.type === "dynamic"
  );
  const twoColumnHeaderItems = ["Indicator", "Response"];
  const threeColumnHeaderItems = ["Number", "Indicator", "Response"];
  const headRowItems = formHasOnlyDynamicFields
    ? twoColumnHeaderItems
    : threeColumnHeaderItems;

  return (
    <Table
      sx={sx.root}
      className={formHasOnlyDynamicFields ? "two-column" : ""}
      content={{
        headRow: headRowItems,
      }}
    >
      {renderFieldTableBody(formFields!, pageType!, entityType)}
    </Table>
  );
};

export const renderFieldTableBody = (
  formFields: FormField[],
  pageType: string,
  entityType?: string
) => {
  const tableRows: ReactElement[] = [];
  // recursively renders field rows
  const renderFieldRow = (field: FormField) => {
    tableRows.push(
      <ExportedReportFieldRow
        key={field.id}
        field={field}
        pageType={pageType}
        entityType={entityType}
      />
    );
    // check for nested child fields; if any, map through children and render
    const fieldChoicesWithChildren = field?.props?.choices?.filter(
      (choice: FieldChoice) => choice?.children
    );
    fieldChoicesWithChildren?.map((choice: FieldChoice) =>
      choice.children?.map((childField: FormField) =>
        renderFieldRow(childField)
      )
    );
  };
  // map through form fields and call renderer
  formFields?.map((field: FormField) => renderFieldRow(field));
  return tableRows || <></>;
};

export interface Props {
  section: StandardReportPageShape | DrawerReportPageShape;
}

const sx = {
  root: {
    marginBottom: "1rem",
    "tr, th": {
      verticalAlign: "top",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
    },
    td: {
      padding: "0.75rem 0.5rem",
      borderStyle: "none",
      fontWeight: "normal",
      color: "palette.base",
      ".shrink &": {
        padding: "0.375rem 0rem",
      },
      ".mobile &": {
        fontSize: "xs",
      },
    },
    th: {
      paddingBottom: "0.375rem",
      fontWeight: "bold",
      lineHeight: "lg",
      color: "palette.gray_medium",
      ".shrink &": {
        padding: "0.375rem 0rem",
      },
      "&:first-of-type": {
        paddingLeft: 0,
      },
    },
    ".desktop &": {
      "&.two-column": {
        "th:first-of-type": {
          paddingLeft: "6rem",
        },
      },
    },
  },
};
