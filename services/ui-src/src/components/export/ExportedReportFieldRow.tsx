// components
import { Box, Tr, Td, Text, Th } from "@chakra-ui/react";
// types
import {
  EntityType,
  FormField,
  FormLayoutElement,
  isFieldElement,
} from "types";
// utils
import {
  parseFormFieldInfo,
  parseCustomHtml,
  renderDataCell,
  useStore,
} from "utils";

export const ExportedReportFieldRow = ({
  formField,
  pageType,
  entityType,
  parentFieldCheckedChoiceIds,
  showHintText = true,
}: Props) => {
  const { report } = useStore();
  const reportData = report?.fieldData;
  const isDynamicField = formField.type === "dynamic";
  const formFieldInfo = parseFormFieldInfo(formField?.props);

  // guard against double-rendering "otherText" response
  const isOtherTextEntry = formField.id.endsWith("-otherText");
  if (isOtherTextEntry) return null;

  return (
    <Tr data-testid="exportRow">
      {/* number column/cell */}
      {!isDynamicField && (
        <Th sx={sx.numberColumn}>
          <Text sx={sx.fieldNumber}>
            {formFieldInfo?.number?.replace(".", "") || "N/A"}
          </Text>
        </Th>
      )}

      {/* label column/cell */}
      <Td sx={sx.labelColumn}>
        {formFieldInfo?.label || formFieldInfo?.hint ? (
          <Box>
            {formFieldInfo.label && (
              <Text sx={sx.fieldLabel}>
                {!isDynamicField
                  ? formFieldInfo?.label
                  : formField?.props?.label}
              </Text>
            )}
            {showHintText && formFieldInfo?.hint && (
              <Box sx={sx.fieldHint}>
                {parseCustomHtml(formFieldInfo?.hint)}
              </Box>
            )}
          </Box>
        ) : (
          <Text>{"N/A"}</Text>
        )}
      </Td>

      {/* data column/cell */}
      <Td sx={sx.dataColumn}>
        {reportData &&
          isFieldElement(formField) &&
          renderDataCell(
            formField,
            reportData,
            pageType,
            entityType,
            parentFieldCheckedChoiceIds
          )}
      </Td>
    </Tr>
  );
};

export interface Props {
  formField: FormField | FormLayoutElement;
  pageType: string;
  entityType?: EntityType;
  parentFieldCheckedChoiceIds?: string[];
  showHintText?: boolean;
}

const sx = {
  numberColumn: {
    width: "5.5rem",
    paddingTop: "spacer1",
  },
  fieldNumber: {
    fontSize: "sm",
    fontWeight: "bold",
    textTransform: "none",
    paddingLeft: "spacer1",
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
    fontSize: "sm",
    fontWeight: "bold",
    marginBottom: "spacer1",
  },
  fieldHint: {
    lineHeight: "lg",
    color: "gray",
  },
  dataColumn: {
    maxWidth: "20rem",
  },
};
