import { ReactElement, useContext } from "react";
// components
import { ExportedReportFieldRow, ReportContext, Table } from "components";
// types, utils
import {
  FieldChoice,
  FormField,
  StandardReportPageShape,
  DrawerReportPageShape,
  ReportShape,
  AnyObject,
} from "types";
// verbiage
import verbiage from "verbiage/pages/export";

export const ExportedReportFieldTable = ({ section }: Props) => {
  const { report } = useContext(ReportContext);
  const { tableHeaders } = verbiage;

  const pageType = section.pageType;
  const formFields =
    pageType === "drawer" ? section.drawerForm?.fields : section.form?.fields;
  const entityType = section.entityType;

  const formHasOnlyDynamicFields = formFields?.every(
    (field: FormField) => field.type === "dynamic"
  );
  const twoColumnHeaderItems = [tableHeaders.indicator, tableHeaders.response];
  const threeColumnHeaderItems = [
    tableHeaders.number,
    tableHeaders.indicator,
    tableHeaders.response,
  ];
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
      {renderFieldTableBody(formFields!, pageType!, report, entityType)}
    </Table>
  );
};

export const renderFieldTableBody = (
  formFields: FormField[],
  pageType: string,
  report: ReportShape | undefined,
  entityType?: string
) => {
  const tableRows: ReactElement[] = [];
  // recursively renders field rows
  const renderFieldRow = (
    formField: FormField,
    applicableDrawers?: string[]
  ) => {
    tableRows.push(
      <ExportedReportFieldRow
        key={formField.id}
        formField={formField}
        pageType={pageType}
        entityType={entityType}
        applicableDrawers={applicableDrawers}
      />
    );
    // check for nested child fields; if any, map through children and render
    const nestedChildren = formField?.props?.choices?.filter(
      (choice: FieldChoice) => {
        // Only render nested items for checked choices
        const selected = report?.fieldData[formField.id];
        const entryExists = selected?.find((selectedChoice: any) =>
          selectedChoice.key.endsWith(choice.id)
        );
        return entryExists && choice?.children;
      }
    );
    nestedChildren?.forEach((choice: FieldChoice) =>
      choice.children?.forEach((childField: FormField) =>
        renderFieldRow(childField)
      )
    );
    // Special handling for questions that repeat multiple times
    if (pageType === "drawer") {
      const drawerItems = report?.fieldData[entityType!];
      formField?.props?.choices?.forEach((choice: FieldChoice) => {
        // Only render nested items for checked choices
        const parentsWithChoice = drawerItems?.filter((drawerItem: any) =>
          Object.keys(drawerItem)?.find((drawerItemKey: any) => {
            return (
              Array.isArray(drawerItem[drawerItemKey]) &&
              drawerItem[drawerItemKey].find((entry: any) =>
                entry.key?.endsWith(choice.id)
              )
            );
          })
        );
        const applicableEntries = parentsWithChoice?.map(
          (parent: AnyObject) => parent.id
        );

        if (
          parentsWithChoice &&
          parentsWithChoice.length > 0 &&
          choice?.children
        ) {
          choice.children?.forEach((childField: FormField) =>
            renderFieldRow(childField, applicableEntries)
          );
        }
      });
    }
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
