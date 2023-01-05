import { ReactElement, useContext } from "react";
// components
import { Box, Tr, Td } from "@chakra-ui/react";
import { ExportedSectionHeading, ReportContext, Table } from "components";
// types, utils
import {
  AnyObject,
  FormField,
  FieldChoice,
  StandardReportPageShape,
} from "types";
import { parseFieldLabel } from "utils";

export const ExportedStandardReportSection = ({
  section: { form, name, verbiage },
}: Props) => {
  const { report } = useContext(ReportContext);
  const fieldData = report?.fieldData;
  const formFields = form.fields;

  const formHasOnlyDynamicFields = formFields.every(
    (field: FormField) => field.type === "dynamic"
  );
  const twoColumnHeaderItems = ["Indicator", "Response"];
  const threeColumnHeaderItems = ["Number", "Indicator", "Response"];
  const headRowItems = formHasOnlyDynamicFields
    ? twoColumnHeaderItems
    : threeColumnHeaderItems;

  return (
    <Box data-testid="exportedStandardReportSection" mt="2rem">
      <ExportedSectionHeading
        heading={verbiage?.intro.subsection || name}
        verbiage={verbiage}
      />
      <Table
        sx={sx.dataTable}
        className={formHasOnlyDynamicFields ? "two-column" : "three-column"}
        content={{
          headRow: headRowItems,
        }}
      >
        {/* TODO: account for dynamicField */}
        {renderFieldTableBody(formFields, fieldData!)}
      </Table>
    </Box>
  );
};

export const renderFieldTableBody = (
  formFields: FormField[],
  fieldData: AnyObject
) => {
  const tableRows: ReactElement[] = [];

  // recursively renders field rows
  const renderFieldRow = (field: FormField) => {
    const fieldInfo = parseFieldLabel(field?.props!); // TODO: account for dynamicField
    tableRows.push(
      <Tr>
        <Td>{fieldInfo.indicator}</Td>
        <Td>{fieldInfo.label}</Td>
        <Td>{fieldData}</Td>
      </Tr>
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
  formFields.map((field: FormField) => renderFieldRow(field));
  return tableRows || <></>;
};

export interface Props {
  section: StandardReportPageShape;
}

const sx = {
  dataTable: {
    marginBottom: "1rem",
    ".answers": {
      p: {
        margin: "0 0 1rem",
      },
    },
    p: {
      strong: {
        display: "inline-block",
        marginBottom: "0.5rem",
        fontSize: "1rem",
      },
    },
    "th, td": {
      verticalAlign: "top",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
    },
    "&.three-column": {
      "th, td": {
        "&:first-of-type": {
          width: "5.5rem",
        },
        "&:nth-last-of-type(2)": {
          width: "14rem",
        },
      },
    },
    "&.two-column": {
      tr: {
        p: {
          marginBottom: "1rem",
          "&:last-of-type": {
            marginBottom: 0,
          },
        },
        "th, td": {
          "&:first-of-type": {
            ".desktop &": {
              paddingLeft: "6rem",
            },
          },
          "&:nth-last-of-type(2)": {
            width: "19.5rem",
          },
        },
      },
    },
  },
};
