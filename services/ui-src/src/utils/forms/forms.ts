import React from "react";
import { buildYup } from "schema-to-yup";
// components
import {
  CheckboxField,
  DateField,
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
    date: DateField,
    text: TextField,
    textarea: TextAreaField,
    checkbox: CheckboxField,
    radio: RadioField,
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

export const hydrateFormFields = (formFields: FormField[], data: AnyObject) => {
  // filter to only fields that need hydration
  const fieldsToHydrate = formFields.filter(
    (field: FormField) => !!field.hydrate
  );

  fieldsToHydrate.forEach((field: FormField) => {
    // get index of field in form
    const fieldFormIndex = formFields.indexOf(field!);
    // add value attribute with hydration value
    const hydrationValue = data[field?.hydrate!] || "ERROR";
    formFields[fieldFormIndex].props!.value = hydrationValue;
  });
  return formFields;
};

export const makeFormSchema = (fields: FormField[]) => {
  // make field validation schema
  const fieldSchema: any = { type: "object", properties: {} };
  fields.forEach((field: FormField) => {
    if (field.validation) {
      const { type, options } = field.validation;
      fieldSchema.properties[field.id] = { type, ...options };
    }
  });

  // make error message schema
  const errorMessageSchema: any = { errMessages: {} };
  fields.forEach((field: FormField) => {
    if (field.validation) {
      const { errorMessages } = field.validation;
      errorMessageSchema.errMessages[field.id] = { ...errorMessages };
    }
  });
  // make form schema
  return buildYup(fieldSchema, errorMessageSchema);
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
