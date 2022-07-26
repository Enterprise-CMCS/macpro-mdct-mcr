import { hydrateFormFields, sortFormErrors } from "./forms";

describe("Test sortFormErrors", () => {
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
  it("Correctly sorts only fields with errors", () => {
    const sortedErrors = sortFormErrors(mockFormObject, mockErrorsObject);
    expect(sortedErrors.indexOf("field1")).toEqual(-1);
    expect(sortedErrors).toEqual(sortedArray);
  });
});

describe("Test hydrateFormFields", () => {
  const mockFormFields = [
    {
      id: "mock-field-1",
      type: "text",
      hydrate: "mockData",
      props: {
        name: "mock-field-1",
        label: "1. First mocked field ",
      },
    },
    {
      id: "mock-field-2",
      type: "text",
      hydrate: "unavailableData",
      props: {
        name: "mock-field-2",
        label: "2. Second mocked field ",
      },
    },
  ];
  const mockHydrationData = { mockData: "the mocked data" };

  // it("Correctly hydrates field with provided data", () => {
  //   const hydratedFormFields = hydrateFormFields(
  //     mockFormFields.filter((field) => field.id === "mock-field-1"),
  //     mockHydrationData
  //   );
  //   const hydratedFieldValue = hydratedFormFields.find(
  //     (field) => field.id === "mock-field-1"
  //   )?.props!.hydrate;
  //   expect(hydratedFieldValue).toEqual("the mocked data");
  // });

  // it("Hydrates with 'ERROR' if data unavailable", () => {
  //   const hydratedFormFields = hydrateFormFields(
  //     mockFormFields.filter((field) => field.id === "mock-field-2"),
  //     mockHydrationData
  //   );
  //   const hydratedFieldValue = hydratedFormFields.find(
  //     (field) => field.id === "mock-field-2"
  //   )?.props!.hydrate;
  //   expect(hydratedFieldValue).toEqual("ERROR");
  // });
});
