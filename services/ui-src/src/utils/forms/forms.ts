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
import { number } from "yargs";

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
    // return created element
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
  data?: AnyObject
) => {
  console.log("time to hydrate");
  if (data) {
    formFields.forEach((field: FormField) => {
      // get index of field in form
      const fieldFormIndex = formFields.indexOf(field!);
      console.log("field: ", field);
      console.log("data: ", data);
      console.log("typeof data[field.id]: ", typeof data[field.id]);
      // add value attribute with hydration value
      if (typeof data[field.id] === "object") {
        // populate array fields here
      }
      const hydrationValue = data[field.id] || "ERROR";
      formFields[fieldFormIndex].props!.hydrate = hydrationValue;
    });
  }
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
