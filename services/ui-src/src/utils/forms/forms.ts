import React from "react";
// components
import {
  CheckboxField,
  DateField,
  DropdownField,
  DynamicField,
  NumberField,
  RadioField,
  TextField,
  TextAreaField,
  ChoiceField,
} from "components";
// types
import {
  AnyObject,
  FieldChoice,
  FormField,
  FormLayoutElement,
  isFieldElement,
  ReportShape,
} from "types";
import {
  SectionContent,
  SectionHeader,
} from "components/forms/FormLayoutElements";

// return created elements from provided fields
export const formFieldFactory = (
  fields: Array<FormField | FormLayoutElement>,
  options?: {
    disabled?: boolean;
    nested?: boolean;
    autosave?: boolean;
    validateOnRender?: boolean;
  }
) => {
  // define form field components
  const fieldToComponentMap: AnyObject = {
    checkboxSingle: ChoiceField,
    checkbox: CheckboxField,
    date: DateField,
    dropdown: DropdownField,
    dynamic: DynamicField,
    number: NumberField,
    radio: RadioField,
    text: TextField,
    textarea: TextAreaField,
    sectionHeader: SectionHeader,
    sectionContent: SectionContent,
  };
  fields = initializeChoiceListFields(fields);
  return fields.map((field) => {
    const componentFieldType = fieldToComponentMap[field.type];
    const fieldProps = {
      key: field.id,
      name: field.id,
      hydrate: field.props?.hydrate,
      autoComplete: isFieldElement(field) ? "one-time-code" : undefined, // stops browsers from forcing autofill
      ...options,
      ...field?.props,
    };
    return React.createElement(componentFieldType, fieldProps);
  });
};

export const hydrateFormFields = (
  formFields: (FormField | FormLayoutElement)[],
  formData: AnyObject | undefined
) => {
  formFields.forEach((field: FormField | FormLayoutElement) => {
    const fieldFormIndex = formFields.indexOf(field!);
    const fieldProps = formFields[fieldFormIndex].props!;
    // check for children on each choice in field props
    if (fieldProps) {
      const choices = fieldProps.choices;
      if (choices) {
        choices.forEach((choice: FieldChoice) => {
          // if a choice has children, recurse
          if (choice.children) {
            hydrateFormFields(choice.children, formData);
          }
        });
      }
    } else {
      // if no props on field, initialize props as empty object
      formFields[fieldFormIndex].props = {};
    }
    // set props.hydrate
    const fieldHydrationValue = formData?.[field.id];
    formFields[fieldFormIndex].props!.hydrate = fieldHydrationValue;
  });
  return formFields;
};

// add data to choice fields in preparation for render
export const initializeChoiceListFields = (
  fields: (FormField | FormLayoutElement)[]
) => {
  const fieldsWithChoices = fields.filter(
    (field: FormField | FormLayoutElement) => field.props?.choices
  );
  fieldsWithChoices.forEach((field: FormField | FormLayoutElement) => {
    if (isFieldElement(field)) {
      field?.props?.choices.forEach((choice: FieldChoice) => {
        // set choice value to choice label string
        choice.value = choice.label;
        // if choice id has not already had parent field id appended, do so now
        if (!choice.id.includes("-")) {
          choice.id = field.id + "-" + choice.id;
        }
        choice.name = choice.id;
        // initialize choice as controlled component in unchecked state
        if (choice.checked != true) choice.checked = false;
        // if choice has children, recurse
        if (choice.children) initializeChoiceListFields(choice.children);
      });
    }
  });
  return fields;
};

// create repeated fields per entity specified (e.g. one field for each plan)
export const createRepeatedFields = (
  fields: FormField[],
  reportFieldData?: AnyObject
): FormField[] =>
  // for each form field, check if it needs to be repeated
  fields.flatMap((currentField: FormField) => {
    if (currentField.repeat) {
      // if so, get entities for which the field is to be repeated
      const entities = reportFieldData?.[currentField.repeat];
      if (entities && entities.length) {
        // for each entity, create and return a new field with entity-linked id
        return entities?.map((entity: AnyObject) => {
          const newField = {
            ...currentField,
            id: currentField.id + "_" + entity.id,
            props: {
              ...currentField.props,
              label: entity.name + currentField?.props?.label,
            },
          };
          return newField;
        });
      } else return []; // if no entities, return blank array (later flattened)
    } else return currentField; // if field is not to be repeated, return it unchanged
  });

// returns user-entered data, filtered to only fields in the current form
export const filterFormData = (
  enteredData: AnyObject,
  currentFormFields: FormField[]
) => {
  // translate user-entered data to array for filtration
  const enteredDataEntries = Object.entries(enteredData);
  // flatten current form fields and create array of the form's field ids
  const flattenedFormFields = flattenFormFields(currentFormFields);
  const formFieldArray = flattenedFormFields.map(
    (field: FormField) => field.id
  );
  // filter user-entered data to only fields in the current form
  const userEnteredEntries = enteredDataEntries.filter((fieldData) => {
    const [fieldDataKey] = fieldData;
    return formFieldArray.includes(fieldDataKey);
  });
  // translate data array back to a form data object
  return Object.fromEntries(userEnteredEntries);
};

export const getEntriesToClear = (
  enteredData: AnyObject,
  currentFormFields: FormField[]
) => {
  // Get the users entered data
  const enteredDataEntries = Object.entries(enteredData);
  // Map over the users entered data and get each of the fields ids
  const enteredDataFieldIds = enteredDataEntries.map((enteredField) => {
    return enteredField?.[0];
  });
  // Grab all of the possible form fields that a user could have filled out
  const flattenedFormFields = flattenFormFields(currentFormFields);
  // Find what fields weren't directly entered by the user to send back to be cleared
  const entriesToClear = flattenedFormFields.filter((formField) => {
    return (
      !enteredDataFieldIds.includes(formField.id) && !formField?.props?.disabled
    );
  });
  // Return array of field ID's
  return entriesToClear.map((enteredField) => {
    return enteredField.id;
  });
};

export const setClearedEntriesToDefaultValue = (
  entity: AnyObject,
  entriesToClear: string[]
) => {
  entriesToClear.forEach((entry) => {
    if (Array.isArray(entity[entry])) {
      entity[entry] = [];
    } else if (typeof entity[entry] == "object") {
      entity[entry] = {};
    } else {
      entity[entry] = "";
    }
  });
  return entity;
};

// returns all fields in a given form, flattened to a single level array
export const flattenFormFields = (formFields: FormField[]): FormField[] => {
  const flattenedFields: any = [];
  const compileFields = (formFields: FormField[]) => {
    formFields.forEach((field: FormField) => {
      // push field to flattened fields array
      flattenedFields.push(field);
      // if choice has children, recurse
      field?.props?.choices?.forEach((choice: FieldChoice) => {
        if (choice.children) compileFields(choice.children);
      });
    });
  };
  compileFields(formFields);
  return flattenedFields;
};

export const sortFormErrors = (
  form: AnyObject,
  errors: AnyObject
): string[] => {
  // sort errors into new array
  const sortedErrorArray: string[] = [];
  for (let fieldName in form) {
    if (errors[fieldName]) {
      sortedErrorArray.push(fieldName);
    }
  }
  return sortedErrorArray;
};

/*
 * This function resets the 'clear' prop on each field after a ChoiceListField calls
 * clearUncheckedNestedFields(). Upon re-entering a drawer or modal, the field values will
 * be correctly hydrated.
 */
export const resetClearProp = (fields: (FormField | FormLayoutElement)[]) => {
  fields.forEach((field: FormField | FormLayoutElement) => {
    switch (field.type) {
      case "radio":
      case "checkbox":
        field.props?.choices.forEach((childField: FieldChoice) => {
          if (childField?.children) {
            resetClearProp(childField.children);
          }
        });
        field.props = { ...field.props, clear: false };
        resetClearProp(field.props?.choices);
        break;
      default:
        field.props = { ...field.props, clear: false };
        break;
    }
  });
};

// if there are available ILOS, update the nested checkboxes to reflect each one
export const generateIlosFields = (
  report: ReportShape,
  fields: (FormField | FormLayoutElement)[],
  pathname: string
) => {
  const availableIlos = report?.fieldData?.ilos;
  if (availableIlos && pathname.endsWith("ilos")) {
    const updatedChoiceList = updateFieldChoicesByID(
      fields,
      "plan_ilosOfferedByPlan",
      availableIlos
    );
    return updatedChoiceList;
  }
  return fields;
};

export const updateFieldChoicesByID = (
  formFields: (FormField | FormLayoutElement)[],
  id: string,
  fields: AnyObject[]
) => {
  return formFields.map((field) => {
    const updatedChoices: AnyObject[] = [];
    field.props?.choices.map((choice: AnyObject) => {
      updatedChoices.push(
        choice.children
          ? {
              ...choice,
              children: [
                {
                  id: "plan_ilosUtilizationByPlan",
                  type: "checkbox",
                  props: {
                    ...choice.children[0].props,
                    choices: [...fields],
                  },
                  validation: {
                    ...choice.children[0].validation,
                  },
                },
              ],
            }
          : { ...choice }
      );
    });
    return field.id === id
      ? {
          ...field,
          props: {
            ...field.props,
            choices: [...updatedChoices],
          },
        }
      : { ...field };
  });
};
