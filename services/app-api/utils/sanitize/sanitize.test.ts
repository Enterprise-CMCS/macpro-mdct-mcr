import { sanitizeArray, sanitizeObject, sanitizeString } from "./sanitize";

// SAFE TYPES

const safeBoolean = true;
const safeNaN = NaN;
const safeNumber = 2349872;
const safeNull = null;
const safeUndefined = undefined;

// STRINGS

const cleanString = "test";

const dirtyLinkString = "<ul><li><a href=//google.com>click</ul>";
const cleanLinkString = '<ul><li><a href="//google.com">click</a></li></ul>';

// ARRAYS

const dirtyStringArray = [cleanString, dirtyLinkString];
const cleanStringArray = [cleanString, cleanLinkString];

const dirtyNestedStringArray = [dirtyStringArray, dirtyStringArray];
const cleanNestedStringArray = [cleanStringArray, cleanStringArray];

// OBJECTS

const dirtyObject = {
  string: dirtyLinkString,
  array: dirtyStringArray,
};
const cleanObject = {
  string: cleanLinkString,
  array: cleanStringArray,
};

const dirtyObjectArray = [dirtyObject, dirtyObject];
const cleanObjectArray = [cleanObject, cleanObject];

const dirtyComplexObject = {
  string1: cleanString,
  string2: dirtyLinkString,
  array: dirtyStringArray,
  nestedStringArray: dirtyNestedStringArray,
  nestedObjectArray: dirtyObjectArray,
  emptyArray: [],
  object: dirtyObject,
  emptyObject: {},
};
const cleanComplexObject = {
  string1: cleanString,
  string2: cleanLinkString,
  array: cleanStringArray,
  nestedStringArray: cleanNestedStringArray,
  nestedObjectArray: cleanObjectArray,
  emptyArray: [],
  object: cleanObject,
  emptyObject: {},
};

describe("Test sanitizeString", () => {
  test("Test sanitizeString passes through empty strings and clean strings", () => {
    expect(sanitizeString("")).toEqual("");
    expect(sanitizeString(cleanString)).toEqual(cleanString);
  });

  test("Test sanitizeString cleans dirty strings", () => {
    expect(sanitizeString(dirtyLinkString)).toEqual(cleanLinkString);
  });
});

describe("Test sanitizeArray", () => {
  test("Test sanitizeArray passes through empty arrays and clean arrays", () => {
    expect(sanitizeArray([])).toEqual([]);
    expect(sanitizeArray(cleanStringArray)).toEqual(cleanStringArray);
    expect(sanitizeArray(cleanNestedStringArray)).toEqual(
      cleanNestedStringArray
    );
    expect(sanitizeArray(cleanObjectArray)).toEqual(cleanObjectArray);
  });

  test("Test sanitizeArray cleans dirty arrays", () => {
    expect(sanitizeArray(dirtyStringArray)).toEqual(cleanStringArray);
    expect(sanitizeArray(dirtyNestedStringArray)).toEqual(
      cleanNestedStringArray
    );
    expect(sanitizeArray(dirtyObjectArray)).toEqual(cleanObjectArray);
  });
});

describe("Test sanitizeObject", () => {
  test("Test sanitizeObject passes through safe types", () => {
    expect(sanitizeObject({ safeBoolean })).toEqual({ safeBoolean });
    expect(sanitizeObject({ safeNaN })).toEqual({ safeNaN });
    expect(sanitizeObject({ safeNumber })).toEqual({ safeNumber });
    expect(sanitizeObject({ safeNull })).toEqual({ safeNull });
    expect(sanitizeObject({ safeUndefined })).toEqual({ safeUndefined });
  });

  test("Test sanitizeObject passes through empty object, clean object", () => {
    expect(sanitizeObject({})).toEqual({});
    expect(sanitizeObject(cleanObject)).toEqual(cleanObject);
    expect(sanitizeObject(cleanComplexObject)).toEqual(cleanComplexObject);
  });

  test("Test sanitizeObject cleans dirty objects", () => {
    expect(sanitizeObject(dirtyObject)).toEqual(cleanObject);
    expect(sanitizeObject(dirtyComplexObject)).toEqual(cleanComplexObject);
  });
});
