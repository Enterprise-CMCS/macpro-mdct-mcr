import { Box, Link, Text } from "@chakra-ui/react";
import { AnyObject, Choice, EntityShape, FieldChoice, FormField } from "types";

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
export const maskResponseData = (formField: FormField, responseData: any) => {
  switch (formField.props?.mask) {
    case "percentage":
      return responseData + "%";
    case "currency":
      return "$" + responseData;
    default:
      return responseData;
  }
};

export const renderRegularFieldResponse = (
  formField: FormField,
  fieldResponseData: AnyObject,
  noResponseVerbiage: string
) => {
  // check for and handle link fields (email, url)
  const emailTypes = ["email", "emailOptional"];
  const urlTypes = ["url", "urlOptional"];
  const linkTypes = [...emailTypes, ...urlTypes];
  const fieldValidationType =
    typeof formField?.validation === "string"
      ? formField.validation
      : formField.validation.type;
  if (linkTypes.includes(fieldValidationType)) {
    return renderLinkFieldResponse(
      fieldResponseData,
      emailTypes.includes(formField.type),
      noResponseVerbiage
    );
  }
  // handle all other field types
  return (
    <Text sx={fieldResponseData ? sx.regularResponse : sx.noResponse}>
      {fieldResponseData
        ? maskResponseData(formField, fieldResponseData)
        : noResponseVerbiage}
    </Text>
  );
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

export const renderStandardDataCell = (
  formField: FormField,
  fieldResponseData: AnyObject,
  allResponseData: AnyObject,
  noResponseVerbiage: string
) => {
  // check for and handle choice list fields (checkbox, radio)
  const choiceListFields = ["checkbox", "radio"];
  if (choiceListFields.includes(formField.type)) {
    return renderChoiceListFieldResponse(
      formField,
      fieldResponseData,
      allResponseData,
      noResponseVerbiage
    );
  }
  // handle all other field types
  return renderRegularFieldResponse(
    formField,
    fieldResponseData,
    noResponseVerbiage
  );
};

export const renderDynamicDataCell = (
  fieldResponseData: AnyObject,
  noResponseVerbiage: string
) => {
  return (
    fieldResponseData?.map((entity: EntityShape) => (
      <Text key={entity.id} sx={sx.entityItem}>
        {entity.name}
      </Text>
    )) ?? <Text sx={sx.noResponse}>{noResponseVerbiage}</Text>
  );
};

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
        {formField.type === "checkbox" || formField.type === "radio"
          ? /* handle choice list fields (radio, checkbox) */
            renderChoiceListFieldResponse(
              formField,
              fieldResponseData,
              entityResponseData,
              noResponseVerbiage
            )
          : /* handle all other field types */
            renderRegularFieldResponse(
              formField,
              fieldResponseData,
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
