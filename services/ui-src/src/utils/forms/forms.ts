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

// return created elements from provided fields
export const formFieldFactory = (fields: FormField[], isNested?: boolean) => {
  // define form field components
  const fieldToComponentMap: any = {
    checkbox: CheckboxField,
    date: DateField,
    dropdown: DropdownField,
    dynamic: DynamicField,
    number: NumberField,
    radio: RadioField,
    text: TextField,
    textarea: TextAreaField,
  };
  fields = initializeChoiceFields(fields);
  fields = initializeDropdownFields(fields);
  return fields.map((field) => {
    const componentFieldType = fieldToComponentMap[field.type];
    const fieldProps = {
      key: field.id,
      name: field.id,
      nested: isNested,
      hydrate: field.props?.hydrate,
      ...field?.props,
    };
    return React.createElement(componentFieldType, fieldProps);
  });
};

export const hydrateFormFields = (
  formFields: FormField[],
  reportData: AnyObject
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
            hydrateFormFields(choice.children, reportData);
          }
        });
      }
    } else {
      // if no props on field, initialize props as empty object
      formFields[fieldFormIndex].props = {};
    }
    // set props.hydrate
    const fieldHydrationValue = reportData?.fieldData?.[field.id];
    formFields[fieldFormIndex].props!.hydrate = fieldHydrationValue;
  });
  return formFields;
};

// add data to choice fields in preparation for render
export const initializeChoiceFields = (fields: FormField[]) => {
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
      if (choice.children) initializeChoiceFields(choice.children);
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
    // if first option is not already a blank default value
    if (field?.props?.options[0].value !== "") {
      // add initial blank option
      field?.props?.options.splice(0, 0, { label: "", value: "" });
    }
  });
  return fields;
};

export const sortFormErrors = (form: any, errors: any) => {
  // sort errors into new array
  const sortedErrorArray: any = [];
  for (let fieldName in form) {
    if (errors[fieldName]) {
      sortedErrorArray.push(fieldName);
    }
  }
  return sortedErrorArray;
};
