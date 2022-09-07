import { array, mixed, number as numberSchema, string } from "yup";
import { schemaValidationErrors as error } from "verbiage/errors";

// TEXT
export const text = () =>
  string().typeError(error.INVALID_GENERIC).required(error.REQUIRED_GENERIC);
export const textOptional = () => text().notRequired();

// NUMBER
const validNAValues = ["N/A", "Data not available"];

export const number = (isRatio = false) =>
  mixed()
    .test({
      message: error.INVALID_RATIO,
      test: (val) => {
        const replaceCharsRegex = isRatio ? /[,.:]/g : /[,.]/g;
        if (isRatio) {
          const ratio = val.split(":");

          if (
            ratio.length != 2 ||
            ratio[0].trim().length == 0 ||
            ratio[1].trim().length == 0
          ) {
            return false;
          }

          const firstTest = numberSchema()
            .transform((_value) => {
              return Number(ratio[0].replace(replaceCharsRegex, ""));
            })
            .isValidSync(val);
          const secondTest = numberSchema()
            .transform((_value) => {
              return Number(ratio[1].replace(replaceCharsRegex, ""));
            })
            .isValidSync(val);
          return firstTest && secondTest;
        }
        return (
          numberSchema()
            .transform((_value, originalValue) => {
              return Number(
                originalValue.toString().replace(replaceCharsRegex, "")
              );
            })
            .isValidSync(val) || validNAValues.includes(val)
        );
      },
    })
    .test({
      message: error.REQUIRED_GENERIC,
      test: (val) => val != "",
    })
    .required(error.REQUIRED_GENERIC);
export const numberOptional = () => number().notRequired();

// EMAIL
export const email = () => text().email(error.INVALID_EMAIL);
export const emailOptional = () => email().notRequired();

// URL
export const url = () => text().url(error.INVALID_URL);
export const urlOptional = () => url().notRequired();

// DATE
export const date = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .matches(dateFormatRegex, error.INVALID_DATE);
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

// DROPDOWN
export const dropdown = () =>
  string().typeError(error.INVALID_GENERIC).required(error.REQUIRED_GENERIC);

// CHECKBOX
export const checkbox = () =>
  array()
    .min(1, error.REQUIRED_CHECKBOX)
    .of(text())
    .required(error.REQUIRED_CHECKBOX);
export const checkboxOptional = () => checkbox().notRequired();
export const checkboxSingle = () => array();

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
    mixed: number(),
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
