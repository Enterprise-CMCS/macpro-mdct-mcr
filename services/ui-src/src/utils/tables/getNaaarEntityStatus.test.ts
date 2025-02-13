import { getNaaarEntityStatus } from "./getNaaarEntityStatus";

describe("getNaaarEntityStatus()", () => {
  test("returns false", () => {
    expect(getNaaarEntityStatus()).toBe(false);
  });
});
