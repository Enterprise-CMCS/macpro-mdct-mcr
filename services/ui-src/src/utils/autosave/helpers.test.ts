import { createDataToWrite, getFieldValue, shouldAutosave } from "./helpers";
import { ReportStatus } from "types";
import { useFormContext } from "react-hook-form";

const mockTrigger = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: () => {},
  getValues: jest.fn(),
  trigger: mockTrigger,
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;

jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockRhfMethods),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: jest.fn().mockReturnValue(returnValue),
  }));

describe("Should Autosave", () => {
  test("Should autosave if State Rep and something has been changed with autosave ON", () => {
    expect(
      shouldAutosave("currentValue", "something different", true, true, false)
    ).toEqual(true);
  });
  test("Should NOT autosave if State Rep and something has been changed with autosave OFF", () => {
    expect(
      shouldAutosave("currentValue", "something different", false, true, false)
    ).toEqual(false);
  });
  test("Should NOT autosave if not authorized and something has been changed with autosave ON", () => {
    expect(
      shouldAutosave("currentValue", "something different", true, false, false)
    ).toEqual(false);
  });
  test("Should NOT autosave if nothing has changed", () => {
    expect(
      shouldAutosave("same thing", "same thing", true, true, false)
    ).toEqual(false);
  });
});

describe("Get Field Value", () => {
  const mockFormFieldValue = "mock-form-field-value";
  test("", async () => {
    mockGetValues(mockFormFieldValue);
    expect(
      await getFieldValue(useFormContext(), "fieldName", "fieldValue", "")
    ).toEqual("");
  });
});

describe("Create Data To Write", () => {
  test("Writable Data Object with String", () => {
    expect(
      createDataToWrite(
        ReportStatus.NOT_STARTED,
        "fieldName",
        "fieldValue",
        "Jan 1, 2023"
      )
    ).toEqual({
      fieldData: { fieldName: "fieldValue" },
      metadata: { lastAlteredBy: "Jan 1, 2023", status: "Not started" },
    });
  });
  test("Writable Data Object with DropdownChoice", () => {
    expect(
      createDataToWrite(
        ReportStatus.IN_PROGRESS,
        "fieldName",
        {
          label: "fieldLabel",
          value: "fieldValue",
        },
        "Jan 1, 2023"
      )
    ).toEqual({
      fieldData: {
        fieldName: {
          label: "fieldLabel",
          value: "fieldValue",
        },
      },
      metadata: { lastAlteredBy: "Jan 1, 2023", status: "In progress" },
    });
  });
});
