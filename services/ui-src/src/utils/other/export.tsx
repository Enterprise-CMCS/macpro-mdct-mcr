import { Box, Text } from "@chakra-ui/react";
import uuid from "react-uuid";
// types
import {
  AnyObject,
  Choice,
  EntityShape,
  EntityType,
  FieldChoice,
  FormField,
} from "types";
// utils
import { eligibilityGroup, maskResponseData } from "utils";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-export";

// checks for type of data cell to be render and calls the appropriate renderer
export const renderDataCell = (
  formField: FormField,
  allResponseData: AnyObject,
  pageType: string,
  entityType?: EntityType,
  parentFieldCheckedChoiceIds?: string[]
) => {
  // render drawer data cell (list entities & per-entity responses)
  if (pageType === "drawer") {
    let entityResponseData: AnyObject;

    // if there are ILOS added, but no plans, insert this error verbiage as response
    if (
      formField.id === "plan_ilosOfferedByPlan" &&
      !allResponseData["plans"]?.length
    ) {
      entityResponseData = [
        {
          id: uuid(),
          name: verbiage.missingEntry.missingPlans,
        },
      ];
    } else {
      entityResponseData = allResponseData[entityType!]?.length
        ? allResponseData[entityType!]
        : undefined;
    }

    if (
      formField.id === "plan_patientAccessApiReporting" ||
      formField.id === "plan_priorAuthorizationReporting"
    ) {
      const fieldResponseData = allResponseData[formField.id];
      return renderResponseData(
        formField,
        fieldResponseData,
        allResponseData,
        pageType
      );
    }

    return renderDrawerDataCell(
      formField,
      entityResponseData,
      pageType,
      parentFieldCheckedChoiceIds
    );
  }
  // render dynamic field data cell (list dynamic field entities)
  if (formField.type === "dynamic") {
    const fieldResponseData = allResponseData[formField.id]?.length
      ? allResponseData[formField.id]
      : undefined;
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

export const renderOverlayEntityDataCell = (
  formField: FormField,
  entityResponseData: EntityShape[],
  entityId: string,
  parentFieldCheckedChoiceIds?: string[]
) => {
  const entity = entityResponseData.find((ent) => ent.id === entityId);

  if (!entity || !entity[formField.id]) {
    const validationType =
      typeof formField.validation === "object"
        ? formField.validation.type
        : formField.validation;

    if (validationType.includes("Optional")) {
      return <Text>{verbiage.missingEntry.noResponse}, optional</Text>;
    } else {
      return (
        <Text sx={sx.noResponse}>
          {verbiage.missingEntry.noResponse}; required
        </Text>
      );
    }
  }

  const notApplicable =
    parentFieldCheckedChoiceIds &&
    !parentFieldCheckedChoiceIds?.includes(entity.id);
  return (
    <Box>
      <Text>
        {renderResponseData(
          formField,
          entity[formField.id],
          entityResponseData,
          "modalOverlay",
          notApplicable
        )}
      </Text>
    </Box>
  );
};

export const renderDrawerDataCell = (
  formField: FormField,
  entityResponseData: AnyObject | undefined,
  pageType: string,
  parentFieldCheckedChoiceIds?: string[]
) =>
  entityResponseData?.map((entity: EntityShape, index: number) => {
    const notApplicable =
      parentFieldCheckedChoiceIds &&
      !parentFieldCheckedChoiceIds?.includes(entity.id);
    const fieldResponseData = entity[formField.id];

    // check for nested ILOS data
    let nestedIlosResponses = [];
    if (
      formField.id === "plan_ilosUtilizationByPlan" &&
      fieldResponseData?.length
    ) {
      nestedIlosResponses = getNestedIlosResponses(fieldResponseData, entity);
    }

    // check if this is the ILOS topic
    const isMissingPlansMessage =
      entity.name === verbiage.missingEntry.missingPlans;

    return (
      <Box key={entity.id + formField.id} sx={sx.entityBox}>
        <ul>
          <li>
            <Text sx={isMissingPlansMessage ? sx.noResponse : sx.entityName}>
              {entity.name}
            </Text>
          </li>
          <li className="entityResponse">
            {renderResponseData(
              formField,
              fieldResponseData,
              entityResponseData,
              pageType,
              notApplicable,
              index
            )}
          </li>
          {/* If there are nested ILOS responses available, render them here */}
          {nestedIlosResponses.length > 0
            ? nestedIlosResponses.map((response: AnyObject, index: number) => {
                return (
                  <li key={index}>
                    <Box sx={sx.nestedIlos}>
                      {response.key}: {response.value}
                    </Box>
                  </li>
                );
              })
            : formField.id === "plan_ilosOfferedByPlan" &&
              !("plan_ilosOfferedByPlan" in entity) && (
                // there are plans added, but no responses for its nested ILOS
                <Text sx={sx.noResponse}>
                  {verbiage.missingEntry.noResponse}
                </Text>
              )}
        </ul>
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
  notApplicable?: boolean,
  entityIndex?: number
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

  if (!hasResponse) {
    const isIlos = formField.id === "plan_ilosOfferedByPlan";
    return (
      !isIlos && <Text sx={missingEntryStyle}>{missingEntryVerbiage}</Text>
    );
    // need to explicitly make this else if conditional so
  }

  // handle choice list fields (checkbox, radio)
  if (isChoiceListField) {
    return renderChoiceListFieldResponse(
      formField,
      fieldResponseData,
      widerResponseData,
      pageType,
      entityIndex!
    );
  }
  // handle all other field types
  return renderDefaultFieldResponse(formField, fieldResponseData);
};

export const renderChoiceListFieldResponse = (
  formField: FormField,
  fieldResponseData: AnyObject,
  widerResponseData: AnyObject,
  pageType: string,
  entityIndex: number
) => {
  // filter potential choices to just those that are selected
  const potentialFieldChoices = formField.props?.choices;
  const selectedChoices = potentialFieldChoices.filter(
    (potentialChoice: FieldChoice) => {
      return fieldResponseData?.find((element: Choice) =>
        element.key.includes(potentialChoice.id)
      );
    }
  );
  const choicesToDisplay = selectedChoices?.map((choice: FieldChoice) => {
    // get related "otherText" value, if present (always only a single child element here)
    const firstChildId = choice?.children?.[0]?.id!;
    const shouldDisplayRelatedOtherTextEntry =
      choice.children?.[0]?.id.endsWith("-otherText");
    const relatedOtherTextEntry =
      pageType === "drawer"
        ? widerResponseData[entityIndex]?.[firstChildId]
        : widerResponseData?.[firstChildId];
    return (
      <Text key={choice.id} sx={sx.fieldChoice}>
        {choice.label}
        {shouldDisplayRelatedOtherTextEntry && " – " + relatedOtherTextEntry}
      </Text>
    );
  });
  return choicesToDisplay;
};

export const renderDefaultFieldResponse = (
  formField: FormField,
  fieldResponseData: AnyObject
) => {
  // check and handle fields that need a mask applied
  const fieldMask = formField.props?.mask;
  if (fieldMask)
    return <Text>{maskResponseData(fieldResponseData, fieldMask)}</Text>;
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
      : formField.validation?.type;
  return {
    isLink: linkTypes.includes(fieldValidationType ?? ""),
    isEmail: emailTypes.includes(fieldValidationType ?? ""),
  };
};

// parse field info from field props
export const parseFormFieldInfo = (formFieldProps?: AnyObject) => {
  if (
    formFieldProps === undefined ||
    Object.values(formFieldProps).every((x) => typeof x === "undefined")
  )
    return {};
  const labelArray = formFieldProps?.label?.split(" ");
  return {
    number: labelArray?.[0].match(/[-.0-9]+/) ? labelArray?.[0] : "N/A",
    label: labelArray?.[0].match(/[-.0-9]+/)
      ? labelArray?.slice(1)?.join(" ")
      : labelArray?.join(" "),
    hint: formFieldProps?.hint,
    indicator: formFieldProps?.indicator,
  };
};

export const getEntityDetailsMLR = (entity: EntityShape) => {
  const { report_programName, report_planName } = entity;

  const reportingPeriod = `${entity.report_reportingPeriodStartDate} to ${entity.report_reportingPeriodEndDate}`;
  const mlrEligibilityGroup = eligibilityGroup(entity);

  return {
    report_planName,
    report_programName,
    reportingPeriod,
    mlrEligibilityGroup,
  };
};

export const getNestedIlosResponses = (
  fieldResponseData: AnyObject,
  entity: EntityShape
) => {
  return fieldResponseData.map((data: AnyObject) => {
    const nestedResponse = entity[`plan_ilosUtilizationByPlan_${data.key}`];
    return {
      key: data.value,
      value: nestedResponse,
    };
  });
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
    verticalAlign: "top",
    marginBottom: "1rem",
    ul: {
      listStyle: "none",
      ".entityResponse": {
        paddingBottom: "0.5rem",
        p: {
          lineHeight: "1.25rem",
          fontSize: "sm",
        },
      },
      p: {
        lineHeight: "1.25rem",
        marginBottom: "0.5rem",
      },
    },
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
  noResponseOptional: {
    color: "palette.base",
  },
  notApplicable: {
    color: "palette.gray_medium",
  },
  nestedIlos: {
    lineHeight: "1.25rem",
    fontSize: "sm",
  },
};
