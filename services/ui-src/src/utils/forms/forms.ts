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
} from "components";
// types
import { AnyObject, FieldChoice, FormField } from "types";
import { dropdownDefaultOptionText } from "../../constants";

// return created elements from provided fields
export const formFieldFactory = (
  fields: FormField[],
  shouldDisableAllFields: boolean,
  isNested?: boolean
) => {
  // define form field components
  const fieldToComponentMap: AnyObject = {
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
  fields = initializeDropdownFields(fields);
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
    const fieldHydrationValue = formData?.fieldData?.[field.id];
    formFields[fieldFormIndex].props!.hydrate = fieldHydrationValue;

    // if dropdown options is a string then retrieve options values from form data
    if (field.type === "dropdown" && field.dynamicValue) {
      const fieldOptions = formData?.fieldData[field?.dynamicValue].map(
        (value: string) => ({
          label: value,
          value: value,
        })
      );

      formFields[fieldFormIndex].props!.options = fieldOptions;
    }
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
      // initialize choice as controlled component in unchecked state
      if (choice.checked != true) choice.checked = false;
      // if choice has children, recurse
      if (choice.children) initializeChoiceListFields(choice.children);
    });
  });
  return fields;
};

// add initial blank option to dropdown fields if needed
export const initializeDropdownFields = (fields: FormField[]) => {
  const dropdownFields = fields.filter(
    (field: FormField) => field.type === "dropdown"
  );
  dropdownFields.forEach((field: FormField) => {
    // if first provided option is not already a blank default value
    if (
      field?.props?.options.length > 0 &&
      field?.props?.options[0].value !== ""
    ) {
      // add initial blank option
      field?.props?.options.splice(0, 0, {
        label: dropdownDefaultOptionText,
        value: "",
      });
    }
  });
  return fields;
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
