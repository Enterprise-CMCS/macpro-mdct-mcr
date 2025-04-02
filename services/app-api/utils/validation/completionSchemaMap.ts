import * as schema from "./completionSchemas";

export const completionSchemaMap: any = {
  text: schema.text(),
  textOptional: schema.textOptional(),
  number: schema.number(),
  numberOptional: schema.numberOptional(),
  numberNotLessThanOne: schema.numberNotLessThanOne(),
  numberNotLessThanZero: schema.numberNotLessThanZero(),
  ratio: schema.ratio(),
  email: schema.email(),
  emailOptional: schema.emailOptional(),
  url: schema.url(),
  urlOptional: schema.urlOptional(),
  date: schema.date(),
  dateOptional: schema.dateOptional(),
  dropdown: schema.dropdown(),
  checkbox: schema.checkbox(),
  checkboxOneOptional: schema.checkboxOneOptional(),
  checkboxOptional: schema.checkboxOptional(),
  checkboxSingle: schema.checkboxSingle(),
  radio: schema.radio(),
  radioOptional: schema.radioOptional(),
  dynamic: schema.dynamic(),
  dynamicOptional: schema.dynamicOptional(),
  validNumber: schema.validNumber(),
  validNumberOptional: schema.validNumberOptional(),
};
