import { Box, Link, Text } from "@chakra-ui/react";
import { AnyObject, Choice, EntityShape, FieldChoice, FormField } from "types";

export const renderDataCell = (
  formField: FormField,
  allResponseData: AnyObject,
  pageType: string,
  entityType?: string
) => {
  const noResponseVerbiage = "Not Answered";
  // render drawer data cell (list entities & per-entity responses)
  if (pageType === "drawer") {
    const entityResponseData = allResponseData[entityType!];
    return renderDrawerDataCell(
      formField,
      entityResponseData,
      noResponseVerbiage
    );
  }
  // render dynamic field data cell (list dynamic field entities)
  if (formField.type === "dynamic") {
    const fieldResponseData = allResponseData[formField.id];
    return renderDynamicDataCell(fieldResponseData, noResponseVerbiage);
  }
  // render standard data cell (just field response data)
  const fieldResponseData = allResponseData[formField.id];
  return renderResponseData(
    formField,
    fieldResponseData,
    allResponseData,
    noResponseVerbiage
  );
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

// masks response data as necessary
export const maskResponseData = (
  formField: FormField,
  fieldResponseData: any
) => {
  switch (formField.props?.mask) {
    case "percentage":
      return fieldResponseData + "%";
    case "currency":
      return "$" + fieldResponseData;
    default:
      return fieldResponseData;
  }
};

export const renderResponseData = (
  formField: FormField,
  fieldResponseData: any,
  widerResponseData: AnyObject,
  noResponseVerbiage: string
) => {
  // check for and handle choice list fields (checkbox, radio)
  if (["checkbox", "radio"].includes(formField.type)) {
    return renderChoiceListFieldResponse(
      formField,
      fieldResponseData,
      widerResponseData,
      noResponseVerbiage
    );
  }
  // check for and handle link fields (email, url)
  const { isLink, isEmail } = checkLinkTypes(formField);
  if (isLink) {
    return renderLinkFieldResponse(
      fieldResponseData,
      isEmail,
      noResponseVerbiage
    );
  }
  // handle all other field types
  return renderDefaultFieldResponse(
    formField,
    fieldResponseData,
    noResponseVerbiage
  );
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

export const renderLinkFieldResponse = (
  fieldResponseData: AnyObject,
  isEmail: boolean,
  noResponseVerbiage: string
) =>
  fieldResponseData ? (
    <Link href={(isEmail ? "mailto:" : "") + fieldResponseData} target="_blank">
      {fieldResponseData}
    </Link>
  ) : (
    <Text sx={sx.noResponse}>{noResponseVerbiage}</Text>
  );

export const renderDefaultFieldResponse = (
  formField: FormField,
  fieldResponseData: AnyObject,
  noResponseVerbiage: string
) => {
  return (
    <Text sx={fieldResponseData ? sx.regularResponse : sx.noResponse}>
      {fieldResponseData
        ? maskResponseData(formField, fieldResponseData)
        : noResponseVerbiage}
    </Text>
  );
};

export const renderChoiceListFieldResponse = (
  formField: FormField,
  fieldResponseData: AnyObject,
  allResponseData: AnyObject,
  noResponseVerbiage: string
) => {
  // filter potential choices to just those that are selected
  const potentialFieldChoices = formField.props?.choices;
  const selectedChoices = potentialFieldChoices.filter(
    (potentialChoice: FieldChoice) =>
      fieldResponseData?.find((element: Choice) =>
        element.key.includes(potentialChoice.id)
      )
  );
  const choicesToDisplay = selectedChoices?.map((choice: FieldChoice) => {
    // get related "otherText" value, if present (always only a single child element here)
    const shouldDisplayRelatedOtherTextEntry =
      choice.children?.[0]?.id.endsWith("-otherText");
    const relatedOtherTextEntry = allResponseData?.[choice?.children?.[0]?.id!];
    return (
      <Text key={choice.id} sx={sx.fieldChoice}>
        {choice.label}
        {shouldDisplayRelatedOtherTextEntry && " – " + relatedOtherTextEntry}
      </Text>
    );
  });
  return selectedChoices.length ? (
    choicesToDisplay
  ) : (
    <Text sx={sx.noResponse}>{noResponseVerbiage}</Text>
  );
};

export const renderDynamicDataCell = (
  fieldResponseData: AnyObject,
  noResponseVerbiage: string
) =>
  fieldResponseData?.map((entity: EntityShape) => (
    <Text key={entity.id} sx={sx.entityItem}>
      {entity.name}
    </Text>
  )) ?? <Text sx={sx.noResponse}>{noResponseVerbiage}</Text>;

export const renderDrawerDataCell = (
  formField: FormField,
  entityResponseData: AnyObject | undefined,
  noResponseVerbiage: string
) =>
  entityResponseData?.map((entity: EntityShape) => {
    const fieldResponseData = entity[formField.id];
    return (
      <Box key={entity.id + formField.id}>
        <Text sx={sx.entityName}>{entity.name}</Text>
        {renderResponseData(
          formField,
          fieldResponseData,
          entityResponseData,
          noResponseVerbiage
        )}
      </Box>
    );
  }) ?? <Text sx={sx.noResponse}>{noResponseVerbiage}</Text>;

const sx = {
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
  regularResponse: {
    marginBottom: "1rem",
  },
  noResponse: {
    color: "palette.error_darker",
    marginBottom: "1rem",
  },
};
