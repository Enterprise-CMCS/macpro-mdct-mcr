import { ReactElement } from "react";
// components
import { Table, ExportedEntityDetailsTableRow } from "components";
// types
import {
  EntityShape,
  FieldChoice,
  FormField,
  ReportShape,
  FormLayoutElement,
  ReportType,
  isFieldElement,
  EntityType,
} from "types";
// utils
import { useStore } from "utils";
// verbiage
import verbiage from "verbiage/pages/mlr/mlr-export";

export const ExportedEntityDetailsTable = ({
  caption,
  fields,
  entity,
  entityType: passedEntityType,
  entityIndex,
}: Props) => {
  const { report } = useStore();
  const { tableHeaders } = verbiage;

  const entityType = passedEntityType ?? EntityType.PROGRAM;

  const threeColumnHeaderItems = [
    tableHeaders.number,
    tableHeaders.indicator,
    tableHeaders.response,
  ];

  const reportType = report?.reportType as ReportType;
  const hideHintText = reportType === ReportType.MLR;

  return (
    <Table
      sx={sx.root}
      content={{
        caption,
        headRow: threeColumnHeaderItems,
      }}
    >
      {renderFieldTableBody(
        fields!,
        "modalOverlay",
        report,
        !hideHintText,
        entity.id,
        entityType,
        entityIndex
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
  entityType: EntityType,
  entityIndex?: number
) => {
  const tableRows: ReactElement[] = [];
  // recursively renders field rows
  const renderFieldRow = (formField: FormField | FormLayoutElement) => {
    const validationType = isFieldElement(formField)
      ? typeof formField.validation === "object"
        ? formField.validation.type
        : formField.validation
      : "";

    const optional =
      validationType && validationType !== ""
        ? validationType.includes("Optional")
        : false;

    tableRows.push(
      <ExportedEntityDetailsTableRow
        key={formField.id}
        formField={formField}
        pageType={pageType}
        entityType={entityType}
        showHintText={showHintText}
        entityId={entityId}
        optional={optional}
        entityIndex={entityIndex}
      />
    );

    const entity = report?.fieldData[entityType].find(
      (e: EntityShape) => e.id === entityId
    );

    // Handle rendering nested children
    if (isFieldElement(formField) && formField.props?.choices) {
      formField.props.choices.forEach((choice: FieldChoice) => {
        // If choice has been selected
        if (
          entity &&
          entity[formField.id] &&
          Array.isArray(entity[formField.id]) &&
          entity[formField.id].length > 0 &&
          entity[formField.id][0].key?.endsWith(choice.id)
        ) {
          if (choice.children) {
            choice.children.forEach((c) => renderFieldRow(c));
          }
        }
      });
    }
  };
  // map through form fields and call renderer
  formFields?.forEach((field: FormField | FormLayoutElement) => {
    renderFieldRow(field);
  });
  return tableRows;
};

export interface Props {
  caption: string;
  fields: FormField[];
  entity: EntityShape;
  entityType?: EntityType;
  entityIndex?: number;
}

const sx = {
  root: {
    "@media print": {
      pageBreakInside: "avoid",
    },
    marginBottom: "spacer2",
    "tr, th": {
      verticalAlign: "top",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "gray_lighter",
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
      color: "base",
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
      color: "gray",
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
