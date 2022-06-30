import React from "react";
import * as yup from "yup";
// components
import { DateField, TextField, TextAreaField } from "components";
// types
import { FormField } from "utils/types/types";

export const makeFormSchema = (fields: FormField[]) => {
  const schema: any = {};
  fields.forEach((field: FormField) => (schema[field.id] = field.validation));
  return yup.object().shape(schema);
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
