import React from "react";
import { buildYup } from "schema-to-yup";
// components
import { DateField, TextField, TextAreaField } from "components";
// types
import { FormField } from "types";

export const makeFormSchema = (fields: FormField[]) => {
  // make field validation schema
  const fieldSchema: any = { type: "object", properties: {} };
  fields.forEach((field: FormField) => {
    const { type, options } = field.validation;
    fieldSchema.properties[field.id] = { type, ...options };
  });

  // make error message schema
  const errorMessageSchema: any = { errMessages: {} };
  fields.forEach((field: FormField) => {
    const { errorMessages } = field.validation;
    errorMessageSchema.errMessages[field.id] = { ...errorMessages };
  });

  // make form schema
  return buildYup(fieldSchema, errorMessageSchema);
};

const fieldToComponentMap: any = {
  text: TextField,
  textarea: TextAreaField,
  datesplit: DateField,
  child: React.Fragment,
};

export const formFieldFactory = (fields: FormField[]) =>
  fields.map((field) =>
    React.createElement(fieldToComponentMap[field.type], {
      key: field.id,
      ...field.props,
    })
  );
