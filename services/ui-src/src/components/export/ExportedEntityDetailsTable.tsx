import { ReactElement, useContext } from "react";
// components
import { ReportContext, Table } from "components";
// types, utils
import {
  EntityShape,
  FieldChoice,
  FormField,
  ReportShape,
  FormLayoutElement,
  ReportType,
} from "types";
// verbiage
import verbiage from "verbiage/pages/mlr/mlr-export";
import { ExportedEntityDetailsTableRow } from "./ExportedEntityDetailsTableRow";

export const ExportedEntityDetailsTable = ({
  fields,
  entity,
  ...props
}: Props) => {
  const { report } = useContext(ReportContext);
  const { tableHeaders } = verbiage;

  const entityType = "program";

  const threeColumnHeaderItems = [
    tableHeaders.number,
    tableHeaders.indicator,
    tableHeaders.response,
  ];

  const reportType = report?.reportType as ReportType;
  const hideHintText = reportType === ReportType.MLR;

  return (
    <Table
      {...props}
      sx={sx.root}
      content={{
        headRow: threeColumnHeaderItems,
      }}
    >
      {renderFieldTableBody(
        fields!,
        "modalOverlay",
        report,
        !hideHintText,
        entity.id,
        entityType
      )}
    </Table>
  );
};

export const renderFieldTableBody = (
  formFields: (FormField | FormLayoutElement)[],
  pageType: string,
  report: ReportShape | undefined,
  showHintText: boolean,
  entityId: string,
  entityType: string
) => {
  const tableRows: ReactElement[] = [];
  // recursively renders field rows
  const renderFieldRow = (
    formField: FormField | FormLayoutElement,
    parentFieldCheckedChoiceIds?: string[]
  ) => {
    tableRows.push(
      <ExportedEntityDetailsTableRow
        key={formField.id}
        formField={formField}
        pageType={pageType}
        entityType={entityType}
        parentFieldCheckedChoiceIds={parentFieldCheckedChoiceIds}
        showHintText={showHintText}
        entityId={entityId}
      />
    );
    const entityData = report?.fieldData[entityType!];
    formField?.props?.choices?.forEach((choice: FieldChoice) => {
      // if choice is checked in any entity, and the choice has children to display, render them
      if (
        entityData.find((e: EntityShape) => e.id === entityId) &&
        choice?.children
      ) {
        choice.children?.forEach((childField: FormField) =>
          renderFieldRow(childField, parentFieldCheckedChoiceIds)
        );
      }
    });
  };
  // map through form fields and call renderer
  formFields?.forEach((field: FormField | FormLayoutElement) => {
    renderFieldRow(field);
  });
  return tableRows;
};

export interface Props {
  fields: FormField[];
  entity: EntityShape;
  showHintText?: boolean;
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
    thead: {
      //this will prevent generating a new header whenever the table spills over in another page
      display: "table-row-group",
    },
    td: {
      p: {
        lineHeight: "1.25rem",
      },
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
