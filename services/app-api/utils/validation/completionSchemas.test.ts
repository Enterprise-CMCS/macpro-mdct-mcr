import {
  checkbox,
  checkboxOneOptional,
  checkboxOptional,
  checkboxSingle,
  date,
  dateOptional,
  dropdown,
  dropdownOptional,
  dynamic,
  dynamicOptional,
  email,
  emailOptional,
  endDate,
  nested,
  number,
  numberNotLessThanOne,
  numberNotLessThanZero,
  numberNotLessThanZeroOptional,
  numberOptional,
  numberSuppressible,
  radio,
  radioOptional,
  radioSchema,
  ratio,
  text,
  textOptional,
  url,
  urlOptional,
  validNumber,
  validNumberOptional,
} from "./completionSchemas";
import * as yup from "yup";

type TestCase =
  | string
  | {
      value: any;
      description: string;
    };
const objectify = (cases: TestCase[], expected: boolean) =>
  cases.map((tc) => {
    if ("string" === typeof tc) {
      return { value: tc, description: tc, expected };
    } else if (!tc.description) {
      return { value: tc.value, description: tc.value, expected };
    } else {
      return { value: tc.value, description: tc.description, expected };
    }
  });
const accept = (cases: TestCase[]) => objectify(cases, true);
const reject = (cases: TestCase[]) => objectify(cases, false);

const emptyResponses = [
  { value: null, description: "null" },
  { value: undefined, description: "undefined" },
  { value: "", description: "empty string" },
];

const nonNumericValues = [
  "abc",
  "N",
  { value: "!@#!@%", description: "keysmash" },
];

/** All of these are greater than one */
const positiveNumbers = [
  "123",
  "123.00",
  "123..00",
  { value: "1,230", description: "large number with commas" },
  { value: "1,2,30", description: "too many commas" },
  { value: "1230", description: "large number without commas" },
  { value: "123450123..,,,.123123123123", description: "punctuation jamboree" },
];

/** All of these are less than zero */
const negativeNumbers = [
  "-123",
  "-123.00",
  "-123..00",
  { value: "-1,230", description: "large number with commas" },
  { value: "-1,2,30", description: "too many commas" },
  { value: "-1230", description: "large number without commas" },
  {
    value: "-123450123..,,,.123123123123",
    description: "punctuation jamboree",
  },
];

const notApplicableValues = [
  "N/A",
  "NA",
  "na",
  "n/a",
  "N/a",
  "Data not available",
  "NR",
  "nr",
];

const formatMMDDYYYY = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
}).format;

const invalidDates = [
  "10-10-2010",
  "13/13/2013",
  "01/32/1999",
  "02/29/2025",
  "1/2",
  "00/10/2010",
  "10/00/2010",
  "10/10/0000",
  "not a date",
];

const pastDates = [
  "07/02/1964",
  "02/29/2024",
  "10/24/2025",
  // yesterday
  formatMMDDYYYY(new Date(new Date().setDate(new Date().getDate() - 1))),
];

const futureDates = [
  // tomorrow
  formatMMDDYYYY(new Date(new Date().setDate(new Date().getDate() + 1))),
  "01/19/2038", // If you're reading this in 2038, hello! Update this please.
];

/** Used to test checkboxes and radio button lists */
const choice = { key: "mock-key", value: "mock-value" };

describe("Completion schemas", () => {
  test.each([...reject(emptyResponses), ...accept(["any nonempty string"])])(
    "text() $description -> $expected",
    ({ value, expected }) => {
      expect(text().isValidSync(value)).toBe(expected);
    }
  );

  test.each([
    // ...accept(emptyResponses),
    ...accept(["any nonempty string"]),
  ])("textOptional() $description -> $expected", ({ value, expected }) => {
    expect(textOptional().isValidSync(value)).toBe(expected);
  });

  test.each([
    ...reject(emptyResponses),
    ...reject(nonNumericValues),
    ...accept(positiveNumbers),
    ...accept(negativeNumbers),
    ...accept(notApplicableValues),
  ])("number() $description -> $expected", ({ value, expected }) => {
    expect(number().isValidSync(value)).toBe(expected);
  });

  test.each([
    // ...accept(emptyResponses),
    ...reject(nonNumericValues),
    ...accept(positiveNumbers),
    ...accept(negativeNumbers),
    ...accept(notApplicableValues),
  ])("numberOptional() $description -> $expected", ({ value, expected }) => {
    expect(numberOptional().isValidSync(value)).toBe(expected);
  });

  test.each([
    ...reject(emptyResponses),
    ...reject(nonNumericValues),
    ...accept(positiveNumbers),
    ...reject(negativeNumbers),
    // ...accept(notApplicableValues),
    ...reject(["0", "0.0", "0.5"]),
    ...accept(["1", "1.5"]),
  ])(
    "numberNotLessThanOne() $description -> $expected",
    ({ value, expected }) => {
      expect(numberNotLessThanOne().isValidSync(value)).toBe(expected);
    }
  );

  test.each([
    ...reject(emptyResponses),
    ...reject(nonNumericValues),
    ...accept(positiveNumbers),
    ...reject(negativeNumbers),
    // ...accept(notApplicableValues),
    ...reject(["-0.5"]),
    ...accept(["0", "0.0", "0.5", "1", "1.5"]),
  ])(
    "numberNotLessThanZero() $description -> $expected",
    ({ value, expected }) => {
      expect(numberNotLessThanZero().isValidSync(value)).toBe(expected);
    }
  );

  test.each([
    ...reject(emptyResponses),
    ...reject(nonNumericValues),
    ...accept(positiveNumbers),
    ...accept(negativeNumbers),
    // ...accept(notApplicableValues),
    ...accept(["Suppressed for data privacy purposes"]),
  ])(
    "numberSuppressible() $description -> $expected",
    ({ value, expected }) => {
      expect(numberSuppressible().isValidSync(value)).toBe(expected);
    }
  );

  test.each([
    // ...accept(emptyResponses),
    ...reject(nonNumericValues),
    ...accept(positiveNumbers),
    ...reject(negativeNumbers),
    // ...accept(notApplicableValues),
    ...reject(["-0.5"]),
    ...accept(["0", "0.0", "0.5", "1", "1.5"]),
  ])(
    "numberNotLessThanZeroOptional() $description -> $expected",
    ({ value, expected }) => {
      expect(numberNotLessThanZeroOptional().isValidSync(value)).toBe(expected);
    }
  );

  test.each([
    ...reject(emptyResponses),
    ...reject(nonNumericValues),
    ...accept(positiveNumbers),
    ...accept(negativeNumbers),
    ...reject(notApplicableValues),
  ])("validNumber() $description -> $expected", ({ value, expected }) => {
    expect(validNumber().isValidSync(value)).toBe(expected);
  });

  test.each([
    // ...accept(emptyResponses),
    ...reject(nonNumericValues),
    ...accept(positiveNumbers),
    ...accept(negativeNumbers),
    ...reject(notApplicableValues),
  ])(
    "validNumberOptional() $description -> $expected",
    ({ value, expected }) => {
      expect(validNumberOptional().isValidSync(value)).toBe(expected);
    }
  );

  test.each([
    ...reject(emptyResponses),
    ...accept(["1:1", "123:123", "1,234:1.12", "0:1", "1:10,000"]),
    ...reject([
      ":",
      ":1",
      "1:",
      "1",
      "1234",
      "abc",
      "N/A",
      "abc:abc",
      ":abc",
      "abc:",
      "%@#$!ASDF",
    ]),
  ])("ratio() $description -> $expected", ({ value, expected }) => {
    expect(ratio().isValidSync(value)).toBe(expected);
  });

  test.each([
    ...reject(emptyResponses),
    ...accept([
      "test@example.com",
      "test.with.dot@multi.part.domain",
      "test+folder@gmail.com",
    ]),
    ...reject(["not an email"]),
  ])("email() $description -> $expected", ({ value, expected }) => {
    expect(email().isValidSync(value)).toBe(expected);
  });

  test.each([
    // ...accept(emptyResponses),
    ...accept([
      "test@example.com",
      "test.with.dot@multi.part.domain",
      "test+folder@gmail.com",
    ]),
    ...reject(["not an email"]),
  ])("emailOptional $description -> $expected", ({ value, expected }) => {
    expect(emailOptional().isValidSync(value)).toBe(expected);
  });

  test.each([
    ...reject(emptyResponses),
    ...accept([
      "http://example.com",
      "https://example.com",
      "https://multi.part.domain/really/long/path?with=params&more=params",
      "ftp://file.transfer.protocol",
    ]),
    ...reject(["not a url"]),
  ])("url() $description -> $expected", ({ value, expected }) => {
    expect(url().isValidSync(value)).toBe(expected);
  });

  test.each([
    // ...accept(emptyResponses),
    ...accept([
      "http://example.com",
      "https://example.com",
      "https://multi.part.domain/really/long/path?with=params&more=params",
      "ftp://file.transfer.protocol",
    ]),
    ...reject(["not a url"]),
  ])("urlOptional $description -> $expected", ({ value, expected }) => {
    expect(urlOptional().isValidSync(value)).toBe(expected);
  });

  test.each([
    ...reject(emptyResponses),
    ...reject(invalidDates),
    ...accept(pastDates),
    ...accept(futureDates),
  ])("date() $description -> $expected", ({ value, expected }) => {
    expect(date().isValidSync(value)).toBe(expected);
  });

  test.each([
    // ...accept(emptyResponses),
    ...reject(invalidDates),
    ...accept(pastDates),
    ...accept(futureDates),
  ])("dateOptional() $description -> $expected", ({ value, expected }) => {
    expect(dateOptional().isValidSync(value)).toBe(expected);
  });

  test.each([
    ...reject(emptyResponses),
    ...reject(invalidDates),
    { value: "10/23/2024", description: "day before", expected: false },
    { value: "10/24/2024", description: "day of", expected: true },
    { value: "10/25/2024", description: "day after", expected: true },
  ])("endDate $description -> $expected", ({ value, expected }) => {
    const schema = yup.object().shape({
      myStartDate: date(),
      myEndDate: endDate("myStartDate"),
    });
    const obj = {
      myStartDate: "10/24/2024",
      myEndDate: value,
    };
    expect(schema.isValidSync(obj)).toBe(expected);
  });

  test.each([
    // { value: undefined, description: "undefined", expected: false },
    { value: "", description: "empty string", expected: false },
    { value: null, description: "null", expected: false },
    { value: 1, description: "1", expected: false },
    {
      value: { label: "Select", value: "nonempty" },
      description: "object with label and value",
      expected: true,
    },
    {
      value: { label: "", value: "nonempty" },
      description: "object without label",
      expected: false,
    },
    {
      value: { label: "", value: "" },
      description: "object without label or value",
      expected: false,
    },
  ])("dropdown $description -> $expected", ({ value, expected }) => {
    expect(dropdown().isValidSync(value)).toBe(expected);
  });

  test.each([
    { value: undefined, description: "undefined", expected: true },
    { value: "", description: "empty string", expected: false },
    { value: null, description: "null", expected: false },
    { value: 1, description: "1", expected: false },
    {
      value: { label: "Select", value: "nonempty" },
      description: "object with label and value",
      expected: true,
    },
    {
      value: { label: "Select", value: "" },
      description: "object with label but empty value",
      expected: true,
    },
    {
      value: { label: "", value: "nonempty" },
      description: "object without label",
      expected: false,
    },
    {
      value: { label: "", value: "" },
      description: "object without label or value",
      expected: false,
    },
  ])(
    "dropdownOptional $description -> $expected",
    async ({ value, expected }) => {
      // Our definition of dropdownOptional does not support `isValidSync`
      const result = await dropdownOptional().isValid(value);
      expect(result).toBe(expected);
    }
  );

  test.each([
    { value: undefined, description: "undefined", expected: false },
    { value: [], description: "empty array", expected: false },
    { value: [choice], description: "one selection", expected: true },
    { value: [choice, choice], description: "two selections", expected: true },
  ])("checkbox $description -> $expected", ({ value, expected }) => {
    expect(checkbox().isValidSync(value)).toBe(expected);
  });

  test.each([
    { value: undefined, description: "undefined", expected: true },
    { value: [], description: "empty array", expected: true },
    { value: [choice], description: "one selection", expected: true },
    { value: [choice, choice], description: "two selections", expected: false },
  ])("checkboxOneOptional $description -> $expected", ({ value, expected }) => {
    expect(checkboxOneOptional().isValidSync(value)).toBe(expected);
  });

  test.each([
    { value: undefined, description: "undefined", expected: true },
    { value: [], description: "empty array", expected: false },
    { value: [choice], description: "one selection", expected: true },
    { value: [choice, choice], description: "two selections", expected: true },
  ])("checkboxOptional $description -> $expected", ({ value, expected }) => {
    expect(checkboxOptional().isValidSync(value)).toBe(expected);
  });

  test.each([
    { value: undefined, description: "undefined", expected: true },
    { value: true, description: "true", expected: true },
    { value: false, description: "false", expected: true },
  ])("checkboxSingle $description -> $expected", ({ value, expected }) => {
    expect(checkboxSingle().isValidSync(value)).toBe(expected);
  });

  test.each([
    { value: undefined, description: "undefined", expected: true },
    { value: [], description: "empty array", expected: true },
    { value: [choice], description: "one selection", expected: true },
    // { value: [choice, choice], description: "two selections", expected: false },
  ])("radioSchema $description -> $expected", ({ value, expected }) => {
    expect(radioSchema().isValidSync(value)).toBe(expected);
  });

  test.each([
    { value: undefined, description: "undefined", expected: false },
    { value: [], description: "empty array", expected: false },
    { value: [choice], description: "one selection", expected: true },
    // { value: [choice, choice], description: "two selections", expected: false },
  ])("radio $description -> $expected", ({ value, expected }) => {
    expect(radio().isValidSync(value)).toBe(expected);
  });

  test.each([
    { value: undefined, description: "undefined", expected: true },
    // { value: [], description: "empty array", expected: false },
    { value: [choice], description: "one selection", expected: true },
    // { value: [choice, choice], description: "two selections", expected: false },
  ])("radioOptional $description -> $expected", ({ value, expected }) => {
    expect(radioOptional().isValidSync(value)).toBe(expected);
  });

  test.each([
    { value: undefined, description: "undefined", expected: false },
    { value: [], description: "empty array", expected: false },
    {
      value: [{ id: "a", name: "a" }],
      description: "one entity",
      expected: true,
    },
    {
      value: [
        { id: "a", name: "a" },
        { id: "a", name: "a" },
      ],
      description: "two entities",
      expected: true,
    },
  ])("dynamic $description -> $expected", ({ value, expected }) => {
    expect(dynamic().isValidSync(value)).toBe(expected);
  });

  test.each([
    { value: undefined, description: "undefined", expected: true },
    { value: [], description: "empty array", expected: true },
    {
      value: [{ id: "a", name: "a" }],
      description: "one entity",
      expected: true,
    },
    {
      value: [
        { id: "a", name: "a" },
        { id: "a", name: "a" },
      ],
      description: "two entities",
      expected: true,
    },
  ])("dynamicOptional $description -> $expected", ({ value, expected }) => {
    expect(dynamicOptional().isValidSync(value)).toBe(expected);
  });

  describe("Nested field validation", () => {
    /*
     * The following tests assume a form that looks like this:
     * fields: [
     *   {
     *     id: "parentId",
     *     type: "radio",
     *     props: {
     *       label: "Got digits?",
     *       choices: [
     *         {
     *           id: "123-noo",
     *           label: "Nope, just my fingers ;)",
     *         },
     *         {
     *           id: "456-yah",
     *           label: "Yep, I have em!",
     *           children: [
     *             {
     *               id: "childId",
     *               label: "What are the digits?",
     *               type: "text",
     *               validation: {
     *                 type: "digits", // defined in the tests below
     *                 nested: true,
     *                 parentFieldName: "parentId",
     *                 parentOptionId: "yah",
     *               },
     *             },
     *           ],
     *         },
     *       ],
     *     },
     *   },
     * ]
     */

    const digits = () => yup.string().matches(/^\d+$/);

    test("Accepts a correct nested field", () => {
      const schema = yup.object().shape({
        childId: nested(() => digits(), "parentId", "yah"),
      });
      const fieldData = {
        parentId: [{ key: "456-yah" }],
        childId: "142536",
      };
      expect(schema.isValidSync(fieldData)).toBe(true);
    });

    test("Rejects an incorrect nested field", () => {
      const schema = yup.object().shape({
        childId: nested(() => digits(), "parentId", "yah"),
      });
      const fieldData = {
        parentId: [{ key: "456-yah" }],
        childId: "qwerty",
      };
      expect(schema.isValidSync(fieldData)).toBe(false);
    });

    test("Accepts a blank optional nested field", () => {
      const schema = yup.object().shape({
        childId: nested(() => digits(), "parentId", "yah"),
      });
      const fieldData = {
        parentId: [{ key: "456-yah" }],
      };
      expect(schema.isValidSync(fieldData)).toBe(true);
    });

    test("Rejects a blank required nested field", () => {
      const schema = yup.object().shape({
        childId: nested(() => digits().required(), "parentId", "yah"),
      });
      const fieldData = {
        parentId: [{ key: "456-yah" }],
      };
      expect(schema.isValidSync(fieldData)).toBe(false);
    });

    test("Accepts any nested value if the parent option does not match", () => {
      const schema = yup.object().shape({
        childId: nested(() => digits().required(), "parentId", "yah"),
      });
      const fieldData = {
        parentId: [{ key: "123-noo" }],
        childId: "qwerty",
      };
      expect(schema.isValidSync(fieldData)).toBe(true);
    });
  });
});
