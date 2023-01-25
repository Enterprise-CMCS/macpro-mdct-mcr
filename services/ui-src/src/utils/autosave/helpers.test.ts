import { createDataToWrite, getFieldValue, shouldAutosave } from "./helpers";
import { ReportStatus } from "types";
import { useFormContext } from "react-hook-form";

const mockRhfMethods = {
  trigger: jest.fn(),
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;

jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockRhfMethods),
}));
const mockTrigger = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    trigger: jest.fn().mockReturnValue(returnValue),
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

describe("GetFieldValue", () => {
  const validFieldValue = "mock-form-field-value";
  const invalidFieldValue = "    ";
  test("Get the VALID field value from the form", async () => {
    mockTrigger(true);
    expect(
      await getFieldValue(useFormContext(), "fieldName", validFieldValue)
    ).toEqual(validFieldValue);
  });

  test("Get the INVALID field value from the form", async () => {
    mockTrigger(false);
    expect(
      await getFieldValue(useFormContext(), "fieldName", invalidFieldValue)
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
