import { maskResponseData, parseFormFieldInfo } from "./export";

const percentageField = {
  fieldData: {
    test_field: "12",
  },
  props: {
    mask: "percentage",
  },
  id: "test_field",
  type: "number",
  validation: "number",
};

const currencyField = {
  fieldData: {
    test_field: "12",
  },
  props: {
    mask: "currency",
  },
  id: "test_field",
  type: "number",
  validation: "number",
};

const emailField = {
  fieldData: {
    test_field: "test@test.com",
  },
  id: "test_field",
  type: "text",
  validation: "email",
};

const urlField = {
  fieldData: {
    test_field: "http://website.com",
  },
  id: "test_field",
  type: "text",
  validation: "url",
};

describe("Test parseFormFieldInfo", () => {
  test("Correctly parses field info when full props are provided", () => {
    const input = { label: "A.1 Label", hint: "Hint" };
    const result = parseFormFieldInfo(input);
    expect(result.number).toEqual("A.1");
    expect(result.label).toEqual("Label");
    expect(result.hint).toEqual("Hint");
  });

  test("Correctly parses field info when empty props are provided", () => {
    const result = parseFormFieldInfo({});
    expect(result.number).toEqual(undefined);
    expect(result.label).toEqual(undefined);
    expect(result.hint).toEqual(undefined);
  });
});

describe("Export: Parsing Data", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Parsing Percentage", () => {
    const dataReturn = maskResponseData(
      percentageField,
      percentageField.fieldData.test_field
    );
    expect(dataReturn).toEqual("12%");
  });
  test("Parsing currency", () => {
    const dataReturn = maskResponseData(
      currencyField,
      currencyField.fieldData.test_field
    );
    expect(dataReturn).toEqual("$12");
  });

  test("Parsing email", () => {
    const dataReturn = maskResponseData(
      emailField,
      emailField.fieldData.test_field
    );
    expect(dataReturn).toEqual(
      <span>
        <a href="mailto:test@test.com">test@test.com</a>
      </span>
    );
  });
});

describe("Export: Number masks", () => {
  test("Percent Mask", () => {
    const dataReturn = maskResponseData(
      percentageField,
      percentageField.fieldData.test_field
    );
    expect(dataReturn).toEqual("12%");
  });

  test("Currency Mask", () => {
    const dataReturn = maskResponseData(
      currencyField,
      currencyField.fieldData.test_field
    );
    expect(dataReturn).toEqual("$12");
  });
});

describe("Export: String Parsing", () => {
  test("Email Link", () => {
    const dataReturn = maskResponseData(
      emailField,
      emailField.fieldData.test_field
    );
    expect(dataReturn).toEqual(
      <span>
        <a href="mailto:test@test.com">test@test.com</a>
      </span>
    );
  });
  test("URL Link", () => {
    const dataReturn = maskResponseData(
      urlField,
      urlField.fieldData.test_field
    );
    expect(dataReturn).toEqual(
      <span>
        <a href="http://website.com">http://website.com</a>
      </span>
    );
  });
});
