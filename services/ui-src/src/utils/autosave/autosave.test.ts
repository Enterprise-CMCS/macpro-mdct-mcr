import { mockStateUser } from "utils/testing/setupJest";
import { autosaveFieldData, isFieldChanged } from "./autosave";

const mockTrigger = jest.fn();

const mockForm: any = {
  trigger: mockTrigger,
};

const report = {
  id: "reportId",
  updateReport: jest.fn().mockResolvedValue(true),
};
const user = {
  userName: mockStateUser.user?.email,
  state: mockStateUser.user?.state,
};

const fields = [
  {
    name: "field1",
    type: "fieldType",
    value: "value1",
    hydrationValue: "value1",
    defaultValue: "defaultValue1",
    overrideCheck: false,
  },
  {
    name: "field2",
    type: "fieldType",
    value: "value2",
    hydrationValue: "value3",
    defaultValue: "defaultValue2",
    overrideCheck: false,
  },
];

describe("autosaveFieldData", () => {
  it("should save fieldData if fields have been updated", async () => {
    mockTrigger.mockResolvedValue(true);
    await autosaveFieldData({ form: mockForm, fields, report, user });
    expect(mockForm.trigger).toHaveBeenCalledWith("field2");
    expect(report.updateReport).toHaveBeenCalledWith(
      { id: "reportId", state: "MN" },
      {
        metadata: {
          status: "In progress",
          lastAlteredBy: "stateuser@test.com",
        },
        fieldData: { field2: "value2" },
      }
    );
  });

  it("should save fieldData with default value if field is invalid", async () => {
    mockTrigger.mockResolvedValue(false);
    await autosaveFieldData({ form: mockForm, fields, report, user });
    expect(mockForm.trigger).toHaveBeenCalledWith("field2");
    expect(report.updateReport).toHaveBeenCalledWith(
      { id: "reportId", state: "MN" },
      {
        metadata: {
          status: "In progress",
          lastAlteredBy: "stateuser@test.com",
        },
        fieldData: { field2: "defaultValue2" },
      }
    );
  });

  it("should save fieldData with default value if no there are no fields to save", async () => {
    mockTrigger.mockResolvedValue(false);
    await autosaveFieldData({ form: mockForm, fields: [], report, user });
    expect(mockForm.trigger).toHaveBeenCalledWith("field2");
    expect(report.updateReport).toHaveBeenCalledWith(
      { id: "reportId", state: "MN" },
      {
        metadata: {
          status: "In progress",
          lastAlteredBy: "stateuser@test.com",
        },
        fieldData: { field2: "defaultValue2" },
      }
    );
  });

  it("should save fieldData with value if validity check is overridden", async () => {
    fields[1].overrideCheck = true;
    await autosaveFieldData({ form: mockForm, fields, report, user });
    expect(report.updateReport).toHaveBeenCalledWith(
      { id: "reportId", state: "MN" },
      {
        metadata: {
          status: "In progress",
          lastAlteredBy: "stateuser@test.com",
        },
        fieldData: { field2: "value2" },
      }
    );
  });
});

describe("ifFieldWasUpdated", () => {
  it("should return 2 if dynamic field has value and is different from hydrationValue", () => {
    const dynamicField = {
      name: "fieldName",
      type: "dynamic",
      value: [{ name: "" }, { name: "value2" }],
      hydrationValue: [
        { name: "hydration-value1" },
        { name: "hydration-value2" },
      ],
    };

    expect(isFieldChanged(dynamicField)).toBe(2);
  });

  it("should return 0 if dynamic field has no value", () => {
    const dynamicField = {
      name: "fieldName",
      type: "dynamic",
      value: [],
      hydrationValue: [
        { name: "hydration-value1" },
        { name: "hydration-value2" },
      ],
    };

    expect(isFieldChanged(dynamicField)).toBe(0);
  });

  it("should return true if non-dynamic field value is different from hydrationValue", () => {
    const nonDynamicField = {
      name: "fieldName",
      type: "non-dynamic",
      value: "value",
      hydrationValue: "hydration-value",
    };

    expect(isFieldChanged(nonDynamicField)).toBe(true);
  });

  it("should return false if non-dynamic field value is same as hydrationValue", () => {
    const nonDynamicField = {
      name: "fieldName",
      type: "non-dynamic",
      value: "value",
      hydrationValue: "value",
    };

    expect(isFieldChanged(nonDynamicField)).toBe(false);
  });
});
