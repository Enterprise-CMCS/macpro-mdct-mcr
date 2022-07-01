import { sortFormErrors } from "./forms";

const mockFormObject = {
  getValues: jest.fn(() => ({
    field1: "",
    field2: "",
    field3: "",
  })),
};

const mockErrorsObject = {
  field3: {
    message: "field 3 is required",
    type: "required",
    ref: undefined,
  },
  field2: {
    message: "field 2 is required",
    type: "required",
    ref: undefined,
  },
};

const sortedArray = ["field2", "field3"];

describe("Test sortFormErrors", () => {
  it("Correctly sorts only fields with errors", () => {
    const sortedErrors = sortFormErrors(mockFormObject, mockErrorsObject);
    expect(sortedErrors.indexOf("field1")).toEqual(-1);
    expect(sortedErrors).toEqual(sortedArray);
  });
});
