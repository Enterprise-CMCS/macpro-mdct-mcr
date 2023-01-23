import { useContext } from "react";
// components
import { Box, Tr, Td, Text } from "@chakra-ui/react";
import { ReportContext } from "components";
// types
import { FormField } from "types";
// utils
import { parseFormFieldInfo, parseCustomHtml, renderDataCell } from "utils";

export const ExportedReportFieldRow = ({
  formField,
  pageType,
  entityType,
  applicableDrawers,
}: Props) => {
  const { report } = useContext(ReportContext);
  const reportData = report?.fieldData;
  const isDynamicField = formField.type === "dynamic";
  const formFieldInfo = parseFormFieldInfo(formField?.props!);

  // guard against double-rendering "otherText" response
  const isOtherTextEntry = formField.id.endsWith("-otherText");
  if (isOtherTextEntry) return null;

  return (
    <Tr data-testid="export-row">
      {/* number column/cell */}
      {!isDynamicField && (
        <Td sx={sx.numberColumn}>
          <Text sx={sx.fieldNumber}>{formFieldInfo.number || "N/A"}</Text>
        </Td>
      )}

      {/* label column/cell */}
      <Td sx={sx.labelColumn}>
        {formFieldInfo.label || formFieldInfo.hint ? (
          <Box>
            {formFieldInfo.label && (
              <Text sx={sx.fieldLabel}>
                {!isDynamicField
                  ? formFieldInfo.label
                  : formField?.props?.label}
              </Text>
            )}
            {formFieldInfo.hint && (
              <Box sx={sx.fieldHint}>{parseCustomHtml(formFieldInfo.hint)}</Box>
            )}
          </Box>
        ) : (
          <Text>{"N/A"}</Text>
        )}
      </Td>

      {/* data column/cell */}
      <Td>
        {reportData &&
          renderDataCell(
            formField,
            reportData,
            pageType,
            entityType,
            applicableDrawers
          )}
      </Td>
    </Tr>
  );
};

export interface Props {
  formField: FormField;
  pageType: string;
  entityType?: string;
  applicableDrawers?: string[];
}

const sx = {
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
        width: "19.5rem",
      },
    },
  },
  fieldLabel: {
    fontSize: "md",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  fieldHint: {
    lineHeight: "lg",
    color: "palette.gray_medium",
  },
};
