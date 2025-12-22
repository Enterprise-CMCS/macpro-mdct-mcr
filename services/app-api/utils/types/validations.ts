export enum ValidationType {
  CHECKBOX = "checkbox",
  CHECKBOX_ONE_OPTIONAL = "checkboxOneOptional",
  CHECKBOX_OPTIONAL = "checkboxOptional",
  DATE = "date",
  DATE_MONTH_YEAR = "dateMonthYear",
  DATE_OPTIONAL = "dateOptional",
  END_DATE = "endDate",
  DROPDOWN = "dropdown",
  DYNAMIC = "dynamic",
  DYNAMIC_OPTIONAL = "dynamicOptional",
  EMAIL = "email",
  EMAIL_OPTIONAL = "emailOptional",
  NUMBER = "number",
  NUMBER_NOT_LESS_THAN_ONE = "numberNotLessThanOne",
  NUMBER_NOT_LESS_THAN_ZERO = "numberNotLessThanZero",
  NUMBER_OPTIONAL = "numberOptional",
  NUMBER_SUPPRESSIBLE = "numberSuppressible",
  RADIO = "radio",
  RADIO_OPTIONAL = "radioOptional",
  TEXT = "text",
  TEXT_OPTIONAL = "textOptional",
  URL = "url",
  URL_OPTIONAL = "urlOptional",
}

export interface EndDateValidation {
  dependentFieldName: string;
  type: ValidationType.END_DATE;
}

export interface NestedValidation {
  dependentFieldName?: string;
  nested: boolean;
  parentFieldName: string;
  parentOptionId?: string;
  type: ValidationType;
}
