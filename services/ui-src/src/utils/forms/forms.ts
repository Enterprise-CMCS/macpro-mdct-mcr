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
// utils
import { getReport } from "utils/api/requestMethods/report";
import { FormField } from "types";

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

export const hydrateFormFields = async (formFields: FormField[]) => {
  // fetch db stuff
  const reportKey = "AK2022";
  let response: any;
  try {
    response = await getReport(reportKey);
    console.log("response", response);
  } catch (error: any) {
    console.log("couldn't get");
  }

  // filter to only fields that need hydration
  const fieldsToHydrate = formFields.filter(
    (field: FormField) => !!field.hydrate
  );

  fieldsToHydrate.forEach((field: FormField) => {
    // get index of field in form
    const fieldFormIndex = formFields.indexOf(field!);
    // add value attribute with hydration value
    const hydrationValue = response[field?.hydrate!] || "ERROR";
    formFields[fieldFormIndex].props!.hydrate = hydrationValue;
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
