import { Box, Link, Text } from "@chakra-ui/react";
import { AnyObject, Choice, EntityShape, FieldChoice, FormField } from "types";
import verbiage from "verbiage/pages/export";

// checks for type of data cell to be render and calls the appropriate renderer
export const renderDataCell = (
  formField: FormField,
  allResponseData: AnyObject,
  pageType: string,
  entityType?: string,
  applicableDrawers?: string[]
) => {
  // render drawer data cell (list entities & per-entity responses)
  if (pageType === "drawer") {
    const entityResponseData = allResponseData[entityType!];
    return renderDrawerDataCell(
      formField,
      entityResponseData,
      pageType,
      applicableDrawers
    );
  }
  // render dynamic field data cell (list dynamic field entities)
  if (formField.type === "dynamic") {
    const fieldResponseData = allResponseData[formField.id];
    return renderDynamicDataCell(fieldResponseData);
  }
  // render standard data cell (just field response data)
  const fieldResponseData = allResponseData[formField.id];
  return renderResponseData(
    formField,
    fieldResponseData,
    allResponseData,
    pageType
  );
};

export const renderDrawerDataCell = (
  formField: FormField,
  entityResponseData: AnyObject | undefined,
  pageType: string,
  applicableDrawers?: string[]
) =>
  entityResponseData?.map((entity: EntityShape, entityIndex: number) => {
    const notApplicable =
      applicableDrawers && !applicableDrawers.includes(entity.id);
    const fieldResponseData = entity[formField.id];
    return (
      <Box key={entity.id + formField.id} sx={sx.entityBox}>
        <Text sx={sx.entityName}>{entity.name}</Text>
        {renderResponseData(
          formField,
          fieldResponseData,
          entityResponseData,
          pageType,
          entityIndex,
          notApplicable
        )}
      </Box>
    );
  }) ?? <Text sx={sx.noResponse}>{verbiage.missingEntry.noResponse}</Text>;

export const renderDynamicDataCell = (fieldResponseData: AnyObject) =>
  fieldResponseData?.map((entity: EntityShape) => (
    <Text key={entity.id} sx={sx.dynamicItem}>
      {entity.name}
    </Text>
  )) ?? <Text sx={sx.noResponse}>{verbiage.missingEntry.noResponse}</Text>;

export const renderResponseData = (
  formField: FormField,
  fieldResponseData: any,
  widerResponseData: AnyObject,
  pageType: string,
  entityIndex?: number,
  notApplicable?: boolean
) => {
  const isChoiceListField = ["checkbox", "radio"].includes(formField.type);
  // check for and handle no response
  const hasResponse: boolean = isChoiceListField
    ? fieldResponseData?.length
    : fieldResponseData;
  const missingEntryVerbiage = notApplicable
    ? verbiage.missingEntry.notApplicable
    : verbiage.missingEntry.noResponse;
  const missingEntryStyle = notApplicable ? sx.notApplicable : sx.noResponse;
  if (!hasResponse)
    return <Text sx={missingEntryStyle}>{missingEntryVerbiage}</Text>;
  // chandle choice list fields (checkbox, radio)
  if (isChoiceListField) {
    return renderChoiceListFieldResponse(
      formField,
      fieldResponseData,
      widerResponseData,
      pageType,
      entityIndex
    );
  }
  // check for and handle link fields (email, url)
  const { isLink, isEmail } = checkLinkTypes(formField);
  if (isLink) return renderLinkFieldResponse(fieldResponseData, isEmail);
  // handle all other field types
  return renderDefaultFieldResponse(formField, fieldResponseData);
};

export const renderChoiceListFieldResponse = (
  formField: FormField,
  fieldResponseData: AnyObject,
  widerResponseData: AnyObject,
  pageType: string,
  entityIndex?: number
) => {
  // filter potential choices to just those that are selected
  const potentialFieldChoices = formField.props?.choices;
  //console.log(potentialFieldChoices);
  const selectedChoices = potentialFieldChoices.filter(
    (potentialChoice: FieldChoice) =>
      fieldResponseData?.find((element: Choice) => {
        //console.log(potentialChoice),
        element.key.includes(potentialChoice.id);
      })
  );
  //console.log(selectedChoices);
  const choicesToDisplay = selectedChoices?.map((choice: FieldChoice) => {
    // get related "otherText" value, if present (always only a single child element here)
    const shouldDisplayRelatedOtherTextEntry =
      choice.children?.[0]?.id.endsWith("-otherText");
    const relatedOtherTextEntry =
      pageType === "drawer"
        ? widerResponseData[entityIndex!]?.[choice?.children?.[0]?.id!]
        : widerResponseData?.[choice?.children?.[0]?.id!];
    return (
      <Text key={choice.id} sx={sx.fieldChoice}>
        {choice.label}
        {shouldDisplayRelatedOtherTextEntry && " – " + relatedOtherTextEntry}
      </Text>
    );
  });
  return choicesToDisplay;
};

export const renderLinkFieldResponse = (
  fieldResponseData: AnyObject,
  isEmail: boolean
) => (
  <Link href={(isEmail ? "mailto:" : "") + fieldResponseData} target="_blank">
    {fieldResponseData}
  </Link>
);

export const renderDefaultFieldResponse = (
  formField: FormField,
  fieldResponseData: AnyObject
) => {
  // check and handle fields that need a mask applied
  const fieldMask = formField.props?.mask;
  if (fieldMask)
    return <Text>{maskResponseData(fieldMask, fieldResponseData)}</Text>;
  // render all other fields
  return <Text>{fieldResponseData}</Text>;
};

// check for and handle link fields (email, url)
export const checkLinkTypes = (formField: FormField) => {
  const emailTypes = ["email", "emailOptional"];
  const urlTypes = ["url", "urlOptional"];
  const linkTypes = [...emailTypes, ...urlTypes];
  const fieldValidationType =
    typeof formField?.validation === "string"
      ? formField.validation
      : formField.validation.type;
  return {
    isLink: linkTypes.includes(fieldValidationType),
    isEmail: emailTypes.includes(fieldValidationType),
  };
};

// mask response data as necessary
export const maskResponseData = (fieldMask: string, fieldResponseData: any) => {
  switch (fieldMask) {
    case "percentage":
      return fieldResponseData + "%";
    case "currency":
      return "$" + fieldResponseData;
    default:
      return fieldResponseData;
  }
};

// parse field info from field props
export const parseFormFieldInfo = (formFieldProps: AnyObject) => {
  const labelArray = formFieldProps?.label?.split(" ");
  return {
    number: labelArray?.[0],
    label: labelArray?.slice(1)?.join(" "),
    hint: formFieldProps?.hint,
    indicator: formFieldProps?.indicator,
  };
};

// style object for rendered elements
const sx = {
  fieldChoice: {
    marginBottom: "1rem",
  },
  dynamicItem: {
    marginBottom: "1rem",
  },
  entityBox: {
    marginBottom: "1rem",
    "&:last-of-type": {
      marginBottom: 0,
    },
  },
  entityName: {
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  noResponse: {
    color: "palette.error_darker",
  },
  notApplicable: {
    color: "palette.gray_medium",
  },
};
