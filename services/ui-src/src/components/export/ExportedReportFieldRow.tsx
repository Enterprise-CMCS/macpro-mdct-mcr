import { useContext } from "react";
// components
import { Box, Tr, Td, Text } from "@chakra-ui/react";
import { ReportContext } from "components";
// types, utils
import { AnyObject, EntityShape, FieldChoice, FormField, Choice } from "types";
import { formatFieldData, parseFieldInfo, parseCustomHtml } from "utils";

const renderDataCell = (
  field: FormField,
  reportData: AnyObject,
  pageType: string,
  entityType?: string
) => {
  const noAnswerMessage = "Not Answered";

  // render drawer (aka entity) data cell
  if (pageType === "drawer") {
    const entityData = reportData[entityType!];
    return entityData?.map((entity: EntityShape) => {
      const fieldData = entity[field.id];

      return (
        <Box key={entity.id + field.id}>
          <Text sx={sx.entityName}>{entity.name}</Text>
          <Text sx={fieldData ? sx.entityData : sx.noAnswer}>
            {fieldData ? formatFieldData(field, fieldData) : noAnswerMessage}
          </Text>
        </Box>
      );
    });
  }
  // render dynamic field data cell
  else if (field.type === "dynamic") {
    const fieldData = reportData[field.id];
    return (
      fieldData?.map((entity: EntityShape) => (
        <Text key={entity.id} sx={sx.entityItem}>
          {entity.name}
        </Text>
      )) ?? <Text sx={sx.noAnswer}>{noAnswerMessage}</Text>
    );
  }
  // render standard data cell
  else {
    const fieldData = reportData[field.id];
    // handle checkboxes and radio buttons
    if (field.type === "checkbox" || field.type === "radio") {
      const potentialFieldChoices = field.props?.choices;

      const filteredChoices = potentialFieldChoices.filter(
        (potentialChoice: FieldChoice) => {
          return fieldData?.find((element: any) => {
            return element.key.includes(potentialChoice.id);
          });
        }
      );

      return filteredChoices?.map((potentialChoice: FieldChoice) => {
        const combinedFieldChoiceId = field.id + "-" + potentialChoice.id;
        // should display if there is data for the potential choice
        const shouldDisplayChoice = fieldData?.map(
          (selectedChoice: Choice) =>
            selectedChoice.key === combinedFieldChoiceId
        );

        // get "Other, specify" text area value (always a single child element here)
        let choiceChild = "";
        if (
          potentialChoice.label === "Other, specify" &&
          potentialChoice.children &&
          potentialChoice.children[0].type === "textarea"
        ) {
          choiceChild =
            potentialChoice.label +
            " - " +
            reportData[potentialChoice.children[0].id];
        }

        return (
          shouldDisplayChoice && (
            <Text key={potentialChoice.id} sx={sx.fieldChoice}>
              {choiceChild ? choiceChild : potentialChoice.label}
            </Text>
          )
        );
      });
    } else {
      return (
        <Text sx={!fieldData ? sx.noAnswer : undefined}>
          {fieldData ? formatFieldData(field, fieldData) : noAnswerMessage}
        </Text>
      );
    }
  }
};

export const ExportedReportFieldRow = ({
  field,
  pageType,
  entityType,
}: Props) => {
  const { report } = useContext(ReportContext);
  const reportData = report?.fieldData;
  const isDynamicField = field.type === "dynamic";
  const fieldInfo = parseFieldInfo(field?.props!);

  return (
    <Tr>
      {/* number column */}
      {!isDynamicField && (
        <Td sx={sx.numberColumn}>
          <Text sx={sx.fieldNumber}>{fieldInfo.number || "—"}</Text>
        </Td>
      )}
      {/* label column */}
      <Td sx={sx.labelColumn}>
        {fieldInfo.label ? (
          <Box>
            <Text sx={sx.fieldLabel}>
              {!isDynamicField ? fieldInfo.label : field?.props?.label}
            </Text>
            {fieldInfo.hint && (
              <Box sx={sx.fieldHint}>{parseCustomHtml(fieldInfo.hint)}</Box>
            )}
          </Box>
        ) : (
          <Text>{"—"}</Text>
        )}
      </Td>
      {/* data column */}
      <Td>
        {reportData && renderDataCell(field, reportData, pageType, entityType)}
      </Td>
    </Tr>
  );
};

export interface Props {
  field: FormField;
  pageType: string;
  entityType?: string;
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
  fieldChoice: {
    marginBottom: "1rem",
  },
  entityItem: {
    marginBottom: "1.5rem",
  },
  entityName: {
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  entityData: {
    marginBottom: "1rem",
  },
  noAnswer: {
    color: "palette.error_darker",
    marginBottom: "1rem",
  },
};
