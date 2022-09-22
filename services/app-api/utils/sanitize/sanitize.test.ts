import { sanitizeArray, sanitizeObject, sanitizeString } from "./sanitize";

// SAFE TYPES

const safeBoolean = true;
// const safeNaN = NaN;
const safeNumber = 2349872;
const safeNull = null;
const safeUndefined = undefined;

// STRINGS

const cleanString = "test";

const dirtyImgString = '<img src="foo.png" onload="alert("Hello!")"/>';
const cleanImgString = '<img src="foo.png">';

const dirtyLinkString = "<UL><li><A HREF=//google.com>click</UL>";
const cleanLinkString = '<ul><li><a href="//google.com">click</a></li></ul>';

const dirtyScriptString =
  "<math><mi//xlink:href='data:x,<script>alert(4)</script>'>";
const cleanScriptString = "<math><mi></mi></math>";

const dirtySvgString = "<svg><g/onload=alert(2)//<p>";
const cleanSvgString = "<svg><g></g></svg>";

// ARRAYS

const dirtyStringArray = [
  cleanString,
  dirtyImgString,
  dirtyLinkString,
  dirtySvgString,
  dirtyScriptString,
];
const cleanStringArray = [
  cleanString,
  cleanImgString,
  cleanLinkString,
  cleanSvgString,
  cleanScriptString,
];

const dirtyNestedStringArray = [dirtyStringArray, dirtyStringArray];
const cleanNestedStringArray = [cleanStringArray, cleanStringArray];

// OBJECTS

const dirtyObject = {
  string: dirtyImgString,
  array: dirtyStringArray,
};
const cleanObject = {
  string: cleanImgString,
  array: cleanStringArray,
};

const dirtyObjectArray = [dirtyObject, dirtyObject];
const cleanObjectArray = [cleanObject, cleanObject];

const dirtyComplexObject = {
  string1: cleanString,
  string2: dirtyImgString,
  string3: dirtyLinkString,
  string4: dirtySvgString,
  string5: dirtyScriptString,
  array: dirtyStringArray,
  nestedStringArray: dirtyNestedStringArray,
  nestedObjectArray: dirtyObjectArray,
  emptyArray: [],
  object: dirtyObject,
  emptyObject: {},
};
const cleanComplexObject = {
  string1: cleanString,
  string2: cleanImgString,
  string3: cleanLinkString,
  string4: cleanSvgString,
  string5: cleanScriptString,
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
    expect(sanitizeString(dirtyImgString)).toEqual(cleanImgString);
    expect(sanitizeString(dirtyLinkString)).toEqual(cleanLinkString);
    expect(sanitizeString(dirtySvgString)).toEqual(cleanSvgString);
    expect(sanitizeString(dirtyScriptString)).toEqual(cleanScriptString);
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
    // expect(sanitizeObject({ safeNaN })).toEqual({ safeNaN });
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
