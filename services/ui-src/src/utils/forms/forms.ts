/* eslint-disable no-console */
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

export const formFieldFactory = (fields: FormField[]) => {
  // define form field components
  const fieldToComponentMap: any = {
    choicelist: ChoiceListField,
    // choiceOption: ChoiceField,
    datesplit: DateField,
    text: TextField,
    textarea: TextAreaField,
    // child: React.Fragment,
  };
  console.log("fields passed in to factory", fields);
  // create elements from provided fields
  return fields.map((field) => {
    const fieldChoices = field?.props?.choices;
    if (fieldChoices) {
      fieldChoices.forEach((choice: any, index: number) => {
        console.log("choice", choice, "index", index);
        if (choice.children) {
          field.props.choices[index].checkedChildren = formFieldFactory(
            choice.children
          );
        }
      });
    }
    console.log("FIELD TYPE of", field.id, ":", field.type);
    const componentFieldType = fieldToComponentMap[field.type];

    const propsToAdd = field.props;
    if (propsToAdd.choices) {
      propsToAdd.choices.forEach((choice: any) => {
        delete choice.children;
      });
    }

    if (field.isChild) {
      console.log("IS CHILD");
      propsToAdd["className"] = "ds-c-choice__checkedChild";
    }
    console.log("PROPS TO ADD", propsToAdd);
    const createdComponent = React.createElement(componentFieldType, {
      key: field.id || "temp",
      ...propsToAdd,
    });
    console.log("CREATED COMPONENT", field.id, createdComponent);
    return createdComponent;
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
