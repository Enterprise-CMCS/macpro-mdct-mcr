import React from "react";
// components
import {
  CheckboxField,
  DateField,
  DynamicField,
  NumberField,
  RadioField,
  TextField,
  TextAreaField,
} from "components";
// types
import { AnyObject, FormField } from "types";

// return created elements from provided fields
export const formFieldFactory = (fields: FormField[], isNested?: boolean) => {
  // define form field components
  const fieldToComponentMap: any = {
    checkbox: CheckboxField,
    date: DateField,
    dynamic: DynamicField,
    number: NumberField,
    radio: RadioField,
    text: TextField,
    textarea: TextAreaField,
  };
  return fields.map((field) => {
    const componentFieldType = fieldToComponentMap[field.type];
    return React.createElement(componentFieldType, {
      key: field.id,
      name: field.id,
      nested: isNested,
      ...field?.props,
    });
  });
};

export const hydrateFormFields = (
  formFields: FormField[], // current page form fields
  data: AnyObject // data from db with which to hydrate
) => {
  formFields.forEach((field: FormField) => {
    const fieldFormIndex = formFields.indexOf(field!);
    const fieldProps = formFields[fieldFormIndex].props!;
    const choices = fieldProps.choices;
    if (choices) {
      choices.forEach((choice: any) => {
        // Recurse if choice has child fields
        if (choice.children) {
          hydrateFormFields(choice.children, data);
        }
      });
    }
    formFields[fieldFormIndex].props!.hydrate = data[field.id];
  });
  return formFields;
};

export const sortFormErrors = (form: any, errors: any) => {
  // get correct registration order of form fields
  const orderedFields = Object.keys(form.getValues());
  // sort errors into new array
  const sortedErrorArray: any = [];
  orderedFields.forEach((fieldName: any) => {
    if (errors[fieldName]) {
      sortedErrorArray.push(fieldName);
    }
  });
  return sortedErrorArray;
};
