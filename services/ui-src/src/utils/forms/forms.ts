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

const temporaryHydrationData: AnyObject = {
  stateName: "Temporary state name",
  programName: "Temporary program name",
  reportingPeriodStartDate: "xx/xx/xxxx",
  reportingPeriodEndDate: "xx/xx/xxxx",
  reportSubmissionDate: "xx/xx/xxxx",
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
  formFields.forEach((field: FormField) => {
    // get index of field in form
    const fieldFormIndex = formFields.indexOf(field!);
    // add value attribute with hydration value
    let hydrationValue = "";
    if (data) {
      if (typeof data[field.id] === "object") {
        // populate array fields here
        for (let i = 0; i < data[field.id].length; i++) {
          // TODO: hydrate prop is getting array, but not putting values in textField
          console.log("data[field.id][i]", data[field.id][i]);
          console.log(
            "formFields[fieldFormIndex].props!.hydrate",
            formFields[fieldFormIndex].props!.hydrate
          );
          hydrationValue = data[field.id][i] || "ERROR";
          formFields[fieldFormIndex].props!.hydrate += hydrationValue;
        }
      }
      hydrationValue = data[field.id] || "ERROR";
      formFields[fieldFormIndex].props!.hydrate = hydrationValue;
    }
    // else {
    //   // hydrationValue = temporaryHydrationData[field?.hydrate!] || "ERROR";
    //   // formFields[fieldFormIndex].props!.hydrate = hydrationValue;
    // }
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
