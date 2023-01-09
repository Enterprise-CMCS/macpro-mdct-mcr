import { ReactElement, useContext } from "react";
// components
import { Box, Tr, Td, Text } from "@chakra-ui/react";
import { ReportContext, Table } from "components";
// types, utils
import {
  AnyObject,
  FormField,
  FieldChoice,
  StandardReportPageShape,
  DrawerReportPageShape,
} from "types";
import { newParseFieldInfo, parseAllLevels, parseCustomHtml } from "utils";

export const ExportedReportFieldTable = ({ section }: Props) => {
  const { report } = useContext(ReportContext);
  const fieldData = report?.fieldData;
  const pageType = section?.pageType;
  const formFields =
    pageType === "drawer" ? section.drawerForm!.fields : section.form!.fields;
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
      {/* TODO: account for dynamicField */}
      {renderFieldTableBody(formFields, fieldData!, pageType, entityType)}
    </Table>
  );
};

export const renderFieldTableBody = (
  formFields: FormField[],
  fieldData: AnyObject,
  pageType?: string,
  entityType?: string
) => {
  const tableRows: ReactElement[] = [];

  // recursively renders field rows
  const renderFieldRow = (field: FormField) => {
    const fieldInfo = newParseFieldInfo(field?.props!); // TODO: account for dynamicField
    let drawerData;

    if (pageType === "drawer") {
      drawerData =
        fieldData[entityType!] !== undefined &&
        fieldData[entityType!].map((entity: any) => {
          return (
            <Box sx={sx.entityAnswers}>
              <span>{entity.name}</span>
              <br />
              {parseAllLevels({
                ...field,
                fieldData: entity,
              })}
            </Box>
          );
        });
    }

    tableRows.push(
      <Tr key={field.id}>
        {field.type !== "dynamic" && (
          <Td sx={sx.numberColumn}>
            <Text sx={sx.fieldNumber}>{fieldInfo.number || "—"}</Text>
          </Td>
        )}
        <Td sx={sx.labelColumn}>
          {fieldInfo.label ? (
            <Box>
              <Text sx={sx.fieldLabel}>{fieldInfo.label}</Text>
              {fieldInfo.hint && (
                <Text sx={sx.fieldHint}>{parseCustomHtml(fieldInfo.hint)}</Text>
              )}
            </Box>
          ) : (
            <Text>—</Text>
          )}
        </Td>
        {pageType === "drawer" ? (
          <Td> {drawerData} </Td>
        ) : (
          // TODO: Handle standard form data here
          <Td>{JSON.stringify(fieldData)}</Td>
        )}
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
  numberColumn: {
    width: "5.5rem",
    paddingLeft: 0,
  },
  fieldNumber: {
    fontSize: "md",
    fontWeight: "bold",
  },
  labelColumn: {
    width: "14rem",
    ".two-column &": {
      ".desktop &": {
        paddingLeft: "6rem",
      },
    },
  },
  fieldLabel: {
    fontSize: "md",
    fontWeight: "bold",
  },
  fieldHint: {
    marginTop: "0.5rem",
    lineHeight: "lg",
    color: "palette.gray_medium",
  },
  entityAnswers: {
    marginBottom: "1.5rem",
    span: {
      display: "inline-block",
      marginBottom: "1rem",
      fontSize: "1rem",
      fontWeight: "bold",
    },
  },
};
