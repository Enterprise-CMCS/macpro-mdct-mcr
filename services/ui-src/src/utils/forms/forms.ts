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
import { AnyObject, FieldChoice, FormField } from "types";

const initializeChoiceFieldControl = (fields: FormField[]) => {
  // find each field that contains choices (checkbox or radio)
  fields.forEach((field: FormField) => {
    if (field.props?.choices) {
      // check non true choices as false
      field.props.choices.forEach((choice: FieldChoice) => {
        if (choice.checked != true) {
          choice.checked = false;
        }
        // recurse for child choices
        if (choice.children) {
          initializeChoiceFieldControl(choice.children);
        }
      });
    }
  });
  return fields;
};

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
  fields = initializeChoiceFieldControl(fields);
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

    // if reportData has value for field, set props.hydrate
    const fieldHydrationValue = reportData[field.id];
    if (fieldHydrationValue) {
      formFields[fieldFormIndex].props!.hydrate = fieldHydrationValue;
    }
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
