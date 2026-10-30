export enum ValidationType {
  CHECKBOX = "checkbox",
  CHECKBOX_CUSTOM = "checkboxCustom",
  CHECKBOX_ONE_OPTIONAL = "checkboxOneOptional",
  CHECKBOX_OPTIONAL = "checkboxOptional",
  DATE = "date",
  DATE_MONTH_YEAR = "dateMonthYear",
  DATE_OPTIONAL = "dateOptional",
  DATE_YEAR_2000_OR_LATER = "dateYear2000OrLater",
  DROPDOWN = "dropdown",
  DROPDOWN_OPTIONAL = "dropdownOptional",
  DYNAMIC = "dynamic",
  DYNAMIC_NO_PLACEHOLDER = "dynamicNoPlaceholder",
  DYNAMIC_OPTIONAL = "dynamicOptional",
  EMAIL = "email",
  EMAIL_OPTIONAL = "emailOptional",
  EMAIL_OR_URL_NO_NA = "emailOrUrlNoNA",
  END_DATE = "endDate",
  END_DATE_OPTIONAL = "endDateOptional",
  FUTURE_DATE = "futureDate",
  INTEGER_GREATER_THAN_ZERO_NO_NA = "integerGreaterThanZeroNoNA",
  INTEGER_ZERO_OR_GREATER_NO_NA = "integerZeroOrGreaterNoNA",
  NUMBER = "number",
  NUMBER_NOT_LESS_THAN_ONE = "numberNotLessThanOne",
  NUMBER_NOT_LESS_THAN_ZERO = "numberNotLessThanZero",
  NUMBER_NOT_LESS_THAN_ZERO_OPTIONAL = "numberNotLessThanZeroOptional",
  NUMBER_OPTIONAL = "numberOptional",
  NUMBER_OR_SUPPRESSED = "numberOrSuppressed",
  NUMBER_OR_SUPPRESSED_NO_NA = "numberOrSuppressedNoNA",
  NUMBER_OR_SUPPRESSED_OR_NA_NR = "numberOrSuppressedOrNaNr",
  NUMBER_SUPPRESSIBLE = "numberSuppressible",
  NUMBER_ZERO_OR_GREATER_NO_NA = "numberZeroOrGreaterNoNA",
  NUMBER_ZERO_OR_GREATER_TWO_DECIMALS_NO_NA = "numberZeroOrGreaterTwoDecimalsNoNA",
  PAST_DATE = "pastDate",
  PAST_DATE_OPTIONAL = "pastDateOptional",
  PAST_END_DATE = "pastEndDate",
  PAST_END_DATE_OPTIONAL = "pastEndDateOptional",
  PERCENTAGE_ZERO_TO_HUNDRED_NO_NA = "percentageZeroToHundredNoNA",
  POSITIVE_NUMBER_NO_NA = "positiveNumberNoNA",
  RADIO = "radio",
  RADIO_OPTIONAL = "radioOptional",
  TEXT = "text",
  TEXT_NO_NA = "textNoNA",
  TEXT_NO_NA_OPTIONAL = "textNoNAOptional",
  TEXT_OPTIONAL = "textOptional",
  URL = "url",
  URL_LIST = "urlList",
  URL_OPTIONAL = "urlOptional",
  VALID_NUMBER = "validNumber",
  VALID_NUMBER_NO_NA = "validNumberNoNA",
  VALID_NUMBER_NO_NA_OPTIONAL = "validNumberNoNAOptional",
  VALID_NUMBER_OPTIONAL = "validNumberOptional",
}

// CUSTOM VALIDATIONS
export interface EndDateValidation {
  dependentFieldName: string;
  type: ValidationType.END_DATE | ValidationType.PAST_END_DATE;
}

export interface NestedValidation {
  dependentFieldName?: string;
  nested: boolean;
  options?: ChoiceOptions;
  parentFieldName: string;
  parentOptionId?: string;
  type: ValidationType;
}

export interface CustomValidation {
  type: ValidationType;
  options?: ChoiceOptions;
}

// OPTIONS
export interface ChoiceOptions {
  errorMessage?: string;
}
