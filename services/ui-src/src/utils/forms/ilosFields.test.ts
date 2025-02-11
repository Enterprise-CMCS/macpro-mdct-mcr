import { isIlosCompleted } from "utils";
import { EntityShape } from "types";
import { describe, expect, it } from "vitest";

const mockCompleteIlosEntity: EntityShape = {
  id: "mock-complete-ilos",
  plan_ilosOfferedByPlan: [
    {
      key: "mock-key",
      value: "Yes",
    },
  ],
  plan_ilosUtilizationByPlan: [
    {
      id: "mock-ilos",
      name: "ilos",
    },
  ],
};

const mockIncompleteIlosEntity: EntityShape = {
  id: "mock-incomplete-ilos",
};

describe("isIlosCompleted", () => {
  it("should return TRUE if entity is complete", () => {
    const result = isIlosCompleted(true, mockCompleteIlosEntity);
    expect(result).toBe(true);
  });
  it("should return FALSE if entity is incomplete", () => {
    const result = isIlosCompleted(true, mockIncompleteIlosEntity);
    expect(result).toBe(false);
  });
});
