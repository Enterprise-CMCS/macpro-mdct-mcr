import { array, mixed, number as numberSchema, string } from "yup";
import { schemaValidationErrors as error } from "verbiage/errors";

// TEXT
export const text = () =>
  string().typeError(error.INVALID_GENERIC).required(error.REQUIRED_GENERIC);
export const textOptional = () => text().notRequired();

// NUMBER
const validNAValues = ["N/A", "Data not available"];

export const number = () =>
  numberSchema()
    .transform((_value, originalValue) =>
      Number(originalValue.replace(/,/g, ""))
    )
    .typeError(error.INVALID_NUMBER)
    .required(error.REQUIRED_GENERIC);
export const numberOptional = () => number().notRequired();

export const numberNA = () =>
  mixed()
    .test(
      (val) =>
        numberSchema()
          .transform((_value, originalValue) => {
            return Number(originalValue.replace(/,/g, ""));
          })
          .isValidSync(val) || validNAValues.includes(val)
    )
    .required(error.REQUIRED_GENERIC)
    .typeError(error.INVALID_NUMBER_OR_NA);

// EMAIL
export const email = () => text().email(error.INVALID_EMAIL);
export const emailOptional = () => email().notRequired();

// URL
export const url = () => text().url(error.INVALID_URL);
export const urlOptional = () => url().notRequired();

// DATE
export const date = () =>
  string()
    .matches(dateFormatRegex, error.INVALID_DATE)
    .required(error.REQUIRED_GENERIC);
export const dateOptional = () => date().notRequired();
export const endDate = (startDateField: string) =>
  date().test(
    "is-after-start-date",
    error.INVALID_END_DATE,
    (endDateString, context) => {
      const startDateString = context.parent[startDateField];
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString!);
      return endDate >= startDate;
    }
  );

// CHECKBOX
export const checkbox = () =>
  array()
    .min(1, error.REQUIRED_CHECKBOX)
    .of(text())
    .required(error.REQUIRED_CHECKBOX);
export const checkboxOptional = () => checkbox().notRequired();

// RADIO
export const radio = () =>
  array().min(1).of(text()).required(error.REQUIRED_GENERIC);
export const radioOptional = () => radio().notRequired();

// DYNAMIC
export const dynamic = () =>
  array().min(1).of(text()).required(error.REQUIRED_GENERIC);
export const dynamicOptional = () => dynamic().notRequired();

// NESTED
export const nested = (
  fieldSchema: Function,
  parentFieldName: string,
  parentOptionValue: any
) => {
  const fieldTypeMap = {
    array: array(),
    number: number(),
    string: string(),
    date: date(),
  };
  const fieldType: keyof typeof fieldTypeMap = fieldSchema().type;
  const baseSchema: any = fieldTypeMap[fieldType];
  return baseSchema.when(parentFieldName, {
    is: (value: any) => value && value.indexOf(parentOptionValue) != -1,
    then: () => fieldSchema(),
  });
};

// REGEX
export const dateFormatRegex =
  /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})$/;
