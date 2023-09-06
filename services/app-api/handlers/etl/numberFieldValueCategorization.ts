import { ReportMetadata } from "../../utils/types";

/**
 * Qualitative categorization of user-entered values.
 *  - `good` values would already pass our strictest validation.
 *  - `fixable` values are close enough that we can confidently infer the correct value;
 *    usually these just have extra characters like `,`, `%`, `$`, or whitespace.
 *    This also covers fractional numbers formatted without a leading zero, like `.52`.
 *  - `bad` values are far enough from `good` that human intervention is required.
 */
export type FormatLevel = "good" | "fixable" | "bad";

export type Category = {
  name: string;
  level: FormatLevel;
  matcher: (value: string) => boolean;
  count: number;
  values: string[];
};

export type FieldData = {
  /** The ID of this field. Defined in the form template, used to search the report data. */
  fieldId: string;
  /** The entity to which this field belongs. Undefined for fields in the report root. */
  entityType?: string;
  /** The index of this field's occurence in the report data. Usually zero. */
  index: number;
  /** The user-entered value for this field. */
  value: string;
  /** What level of intervention is this field going to need? */
  level: FormatLevel;
};

export type FieldTemplate = {
  fieldId: string;
  entityType?: string;
};

export type ExtractResult = {
  report: ReportMetadata & {
    reportingPeriodStartDate: string;
    reportingPeriodEndDate: string;
    programName: string;
    contactName: string;
    contactEmailAddress: string;
  };
  fields: FieldData[];
};

export const isExtractResultArray = (obj: any): obj is ExtractResult[] => {
  return (
    obj &&
    Array.isArray(obj) &&
    obj[0].report &&
    obj[0].report.id &&
    obj[0].fields &&
    Array.isArray(obj[0].fields) &&
    obj[0].fields[0].fieldId &&
    typeof obj[0].fields[0].index === "number" &&
    obj[0].fields[0].value &&
    obj[0].fields[0].level
  );
};

/**
 * No whitespace.
 * Maybe a negative sign.
 * One or more initial digits.
 * Possibly a decimal point; if so, one or more trailing digits.
 */
const plainNumberPattern = /^-?\d+(\.\d+)?$/;

/**
 * A plain number with no negative sign.
 */
const plainPositiveNumberPattern = /^\d+(\.\d+)?$/;

/**
 * A number with a decimal point, but no initial digits
 */
const leadingDecimalPattern = /^\.\d+$/;

/**
 * A plain number, with the integer part separated into comma groups.
 * The first group must contain one to three digits;
 * Subsequent groups must contain exactly three digits.
 */
const commaNumberPattern = /^-?\d{1,3}(,\d{3})*(\.\d+)?$/;

/**
 * A comma number with no negative sign.
 */
const commaPositivenumberPattern = /^\d{1,3}(,\d{3})*(\.\d+)?$/;

export const Categories = {
  instantiate() {
    return [
      {
        name: "empty",
        level: "good",
        count: 0,
        values: [],
        matcher: (value: string | undefined) => {
          return !value;
        },
      },
      {
        name: "plain number",
        level: "good",
        count: 0,
        values: [],
        matcher: (value: string) => {
          return plainNumberPattern.test(value);
        },
      },
      {
        /*
         * A plain ratio has no negative signs, and exactly one colon.
         * The string on both sides of the colon is a plain number.
         */
        name: "plain ratio",
        level: "good",
        count: 0,
        values: [],
        matcher: (value: string) => {
          const parts = value.split(":");
          return (
            !value.includes("-") &&
            parts.length === 2 &&
            plainNumberPattern.test(parts[0]) &&
            plainNumberPattern.test(parts[1])
          );
        },
      },
      {
        name: "'Data not available' or 'N/A'",
        level: "good",
        count: 0,
        values: [],
        matcher: (value: string) => {
          return value === "Data not available" || value === "N/A";
        },
      },
      {
        name: "number with whitespace and/or proper commas",
        level: "fixable",
        count: 0,
        values: [],
        matcher: (value: string) => {
          return commaNumberPattern.test(value.trim());
        },
      },
      {
        /*
         * A string with exactly one colon, between two parts.
         * Each part may be padded with whitespace.
         * Both parts must be positive.
         * Each part must use commas properly, or not use them at all.
         */
        name: "ratio with whitespace and/or proper commas",
        level: "fixable",
        count: 0,
        values: [],
        matcher: (value: string) => {
          const parts = value.split(":");
          return (
            parts.length === 2 &&
            (commaPositivenumberPattern.test(parts[0].trim()) ||
              plainPositiveNumberPattern.test(parts[0].trim())) &&
            (commaPositivenumberPattern.test(parts[1].trim()) ||
              plainPositiveNumberPattern.test(parts[1].trim()))
          );
        },
      },
      {
        /*
         * A positive dollar amount.
         * It may be padded with whitespace.
         * It may have commas - if so, it uses them properly.
         */
        name: "dollar amount, with possible whitespace and commas",
        level: "fixable",
        count: 0,
        values: [],
        matcher: (value: string) => {
          const trimmed = value.trim();
          if (trimmed[0] !== "$") return false;
          const tail = trimmed.substring(1);
          return (
            plainPositiveNumberPattern.test(tail) ||
            commaPositivenumberPattern.test(tail)
          );
        },
      },
      {
        /*
         * A positive percentage.
         * It may be padded with whiteapce.
         * It may have commas - if so, it uses them properly.
         */
        name: "percent, with possible whitespace and commas",
        level: "fixable",
        count: 0,
        values: [],
        matcher: (value: string) => {
          const trimmed = value.trim();
          if (trimmed[trimmed.length - 1] !== "%") return false;
          const body = trimmed.substring(0, trimmed.length - 1);
          return (
            plainPositiveNumberPattern.test(body) ||
            commaPositivenumberPattern.test(body)
          );
        },
      },
      {
        name: "number with leading decimal point",
        level: "fixable",
        count: 0,
        values: [],
        matcher: (value: string) => {
          return leadingDecimalPattern.test(value);
        },
      },
      {
        name: "ratio with leading decimal point",
        level: "fixable",
        count: 0,
        values: [],
        matcher: (value: string) => {
          const parts = value.split(":");
          return (
            parts.length === 2 &&
            (leadingDecimalPattern.test(parts[0].trim()) ||
              commaPositivenumberPattern.test(parts[0].trim()) ||
              plainPositiveNumberPattern.test(parts[0].trim())) &&
            (leadingDecimalPattern.test(parts[1].trim()) ||
              commaPositivenumberPattern.test(parts[1].trim()) ||
              plainPositiveNumberPattern.test(parts[1].trim()))
          );
        },
      },
      {
        /*
         * Any string containing at least one non-numeric character.
         * That is: any character other than digits, decimal points,
         * negative signs, colons, commas, dollar signs, percent signs,
         * or whitespace.
         */
        name: "non-numeric",
        level: "bad",
        count: 0,
        values: [],
        matcher: (value: string) => {
          return [...value].some(
            (char) => !"0123456789.-:,$% \t".includes(char)
          );
        },
      },
      {
        /*
         * The catchall category.
         * These look like numbers, but didn't match any previous categories.
         * Includes values like "1,0000" and "48." and "646,22"
         */
        name: "malformed number",
        level: "bad",
        count: 0,
        values: [],
        matcher: () => true,
      },
    ] as Category[];
  },
};
