import * as schema from "./schemas";

export const schemaMap: any = {
  text: schema.text(),
  textOptional: schema.textOptional(),
  number: schema.number(),
  numberOptional: schema.numberOptional(),
  ratio: schema.ratio(),
  email: schema.email(),
  emailOptional: schema.emailOptional(),
  url: schema.url(),
  urlOptional: schema.urlOptional(),
  date: schema.date(),
  dateOptional: schema.dateOptional(),
  dropdown: schema.dropdown(),
  checkbox: schema.checkbox(),
  checkboxOptional: schema.checkboxOptional(),
  checkboxSingle: schema.checkboxSingle(),
  radio: schema.radio(),
  radioOptional: schema.radioOptional(),
  dynamic: schema.dynamic(),
  dynamicOptional: schema.dynamicOptional(),
};

// const standardValidationObject = {
//   validation: "text",
// };

// const nestedValidationObject = {
//   validation: {
//     type: "text",
//     nested: true,
//     parentFieldName: "string",
//     visibleOptionValue: "any",
//   },
// };

// const endDateValidationObject = {
//   validation: {
//     type: "endDate",
//     dependentFieldName: "string",
//   },
// };

// const nestedEndDateValidationObject = {
//   validation: {
//     type: "endDate",
//     nested: true,
//     parentFieldName: "string",
//     visibleOptionValue: "any",
//     dependentFieldName: "string",
//   },
// };
