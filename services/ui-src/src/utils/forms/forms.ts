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
import { AnyObject, FieldChoice, FormField } from "types";

export const populateRepeatedFields = (
  fields: FormField[],
  reportFieldData?: AnyObject
): FormField[] => {
  // for each form field, check if it needs to be repeated
  return fields.map((field: FormField) => {
    if (field.repeat) {
      // if field needs to be repeated, get entities for which it is to be repeated
      const entities = reportFieldData?.[field.repeat];
      // for each entity, check if corresponding field already exists
      return entities?.map((entity: AnyObject) => {
        const newFieldAlreadyExists = fields.find((el: any) => {
          return el.id.includes(entity.id);
        });
        if (!newFieldAlreadyExists) {
          // if new field does not already exist, stage new field for addition
          const newFieldId = `${field.id}_${entity.id}`;
          const newFieldLabel = `${entity.name} ${field?.props?.label}`;
          const newField = {
            ...field,
            id: newFieldId,
            props: { ...field.props, label: newFieldLabel },
          };
          return newField;
        } else return field;
      });
    } else return field;
  })[0];
};

// return created elements from provided fields
export const formFieldFactory = (
  fields: FormField[],
  shouldDisableAllFields: boolean,
  isNested?: boolean
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
  };
  fields = initializeChoiceListFields(fields);
  return fields.map((field) => {
    const componentFieldType = fieldToComponentMap[field.type];
    const fieldProps = {
      key: field.id,
      name: field.id,
      nested: isNested,
      hydrate: field.props?.hydrate,
      disabled: shouldDisableAllFields,
      ...field?.props,
    };
    return React.createElement(componentFieldType, fieldProps);
  });
};

export const hydrateFormFields = (
  formFields: FormField[],
  formData: AnyObject | undefined
) => {
  formFields.forEach((field: FormField) => {
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
export const initializeChoiceListFields = (fields: FormField[]) => {
  const fieldsWithChoices = fields.filter(
    (field: FormField) => field.props?.choices
  );
  fieldsWithChoices.forEach((field: FormField) => {
    field?.props?.choices.forEach((choice: FieldChoice) => {
      // set choice value to choice label string
      choice.value = choice.label;
      choice.id = `${field.id}-${choice.id}`;
      choice.name = choice.id;
      // initialize choice as controlled component in unchecked state
      if (choice.checked != true) choice.checked = false;
      // if choice has children, recurse
      if (choice.children) initializeChoiceListFields(choice.children);
    });
  });
  return fields;
};

// returns user-entered data, filtered to only fields in the current form
export const filterFormData = (
  enteredData: AnyObject,
  currentFormFields: FormField[]
) => {
  // translate user-entered data to array for filtration
  const enteredDataEntries = Object.entries(enteredData);
  // create array of the current form's field ids
  const formFieldArray = currentFormFields.map((field: FormField) => field.id);
  // filter user-entered data to only fields in the current form
  const filteredDataEntries = enteredDataEntries.filter((fieldData) => {
    const [fieldDataKey] = fieldData;
    return formFieldArray.includes(fieldDataKey);
  });
  // translate data array back to a form data object
  return Object.fromEntries(filteredDataEntries);
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
