import React from "react";
import { buildYup } from "schema-to-yup";
// components
import {
  ChoiceListField,
  DateField,
  TextField,
  TextAreaField,
} from "components";
// types
import { AnyObject, FormField } from "types";

// define form field components
const fieldToComponentMap: any = {
  choicelist: ChoiceListField,
  datesplit: DateField,
  text: TextField,
  textarea: TextAreaField,
  // TODO: remove after DateField is updated
  child: React.Fragment,
};

// return created elements from provided fields
export const formFieldFactory = (fields: FormField[]) =>
  fields.map((field) => {
    const componentFieldType = fieldToComponentMap[field.type];
    const fieldProps = field.props || {};
    // TODO: remove after DateField is updated
    if (field.type !== "child") {
      fieldProps!.name = field.id;
    }
    // if field is a choiceList component
    const fieldChoices = fieldProps?.choices;
    if (fieldChoices) {
      fieldChoices.forEach((choice: any, index: number) => {
        // if a choice/option has a child field to conditionally render
        const nestedChildren = choice?.children;
        if (nestedChildren) {
          // explicitly set nested class for each nested child
          nestedChildren.forEach((child: any) => {
            child.props["className"] = "ds-c-choice__checkedChild";
          });
          // store ReactNode-converted child field as 'checkedChildren'
          field.props!.choices[index].checkedChildren =
            formFieldFactory(nestedChildren);
          // remove invalid prop 'children'
          delete choice.children;
        }
      });
    }
    // return created element
    return React.createElement(componentFieldType, {
      key: field.id || "temp",
      ...fieldProps,
    });
  });

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
