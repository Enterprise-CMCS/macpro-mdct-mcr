import { useContext } from "react";
// components
import { Box, Tr, Td, Text } from "@chakra-ui/react";
import { ReportContext } from "components";
// types
import { FormField, FormLayoutElement, isFieldElement } from "types";
// utils
import {
  parseFormFieldInfo,
  parseCustomHtml,
  renderOverlayEntityDataCell,
} from "utils";

export const ExportedEntityDetailsTableRow = ({
  formField,
  entityType,
  parentFieldCheckedChoiceIds,
  showHintText = true,
  entityId,
  optional,
}: Props) => {
  const { report } = useContext(ReportContext);
  const reportData = report?.fieldData;
  const isDynamicField = formField.type === "dynamic";
  const formFieldInfo = parseFormFieldInfo(formField?.props!);

  // guard against double-rendering "otherText" response
  const isOtherTextEntry = formField.id.endsWith("-otherText");
  if (isOtherTextEntry) return null;

  return (
    <Tr data-testid="exportRow">
      {/* number column/cell */}
      {!isDynamicField && (
        <Td sx={sx.numberColumn}>
          <Text sx={sx.fieldNumber} fontSize={"sm"}>
            {formFieldInfo.number || "N/A"}
          </Text>
        </Td>
      )}

      {/* label column/cell */}
      <Td sx={sx.labelColumn}>
        {formFieldInfo.label || formFieldInfo.hint ? (
          <Text>
            {formFieldInfo.label && (
              <Text sx={sx.fieldLabel} fontSize={"sm"}>
                {!isDynamicField ? (
                  optional ? (
                    <Box>
                      {formFieldInfo.label}
                      <span className="optional-text"> (optional)</span>
                    </Box>
                  ) : (
                    formFieldInfo.label
                  )
                ) : (
                  formField?.props?.label
                )}
              </Text>
            )}
            {showHintText && formFieldInfo.hint && (
              <Text sx={sx.fieldHint}>
                {parseCustomHtml(formFieldInfo.hint)}
              </Text>
            )}
          </Text>
        ) : (
          <Text>{"N/A"}</Text>
        )}
      </Td>

      {/* data column/cell */}
      <Td>
        {reportData &&
          isFieldElement(formField) &&
          renderOverlayEntityDataCell(
            formField,
            reportData[entityType],
            entityId,
            parentFieldCheckedChoiceIds
          )}
      </Td>
    </Tr>
  );
};

export interface Props {
  formField: FormField | FormLayoutElement;
  pageType: string;
  entityId: string;
  entityType: string;
  parentFieldCheckedChoiceIds?: string[];
  showHintText?: boolean;
  optional?: boolean;
}

const sx = {
  numberColumn: {
    width: "5.5rem",
    paddingLeft: 0,
  },
  fieldNumber: {
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
    fontSize: "sm",
    fontWeight: "bold",
    ".optional-text": {
      fontWeight: "lighter",
    },
  },
  fieldHint: {
    lineHeight: "lg",
    fontSize: "sm",
    color: "palette.gray_medium",
  },
};
