import { ReportShape } from "types";
import { getMlrEntityStatus } from "./getMlrEntityStatus";

describe("Test getMlrEntityStatus", () => {
  test("should return a truthy value if complete", () => {
    const report = {
      formTemplate: {
        validationJson: {
          report_foo: "number",
          report_bar: "numberOptional",
          state_foo: "number",
          unrelated: "number",
        },
      },
    } as unknown as ReportShape;
    expect(
      getMlrEntityStatus(report, {
        id: "1",
        report_foo: 1,
        state_foo: 1,
        unrelated: 1,
      })
    ).toBeTruthy();
    expect(
      getMlrEntityStatus(report, {
        id: "1",
        report_foo: 1,
        state_foo: 1,
        unrelated: null,
      })
    ).toBeTruthy();
  });

  test("should return a falsy value if incomplete", () => {
    const report = {
      formTemplate: {
        validationJson: {
          report_foo: "number",
          report_bar: "numberOptional",
          state_foo: "number",
          unrelated: "number",
        },
      },
    } as unknown as ReportShape;
    expect(
      getMlrEntityStatus(report, { id: "1", report_foo: null, state_foo: 1 })
    ).toBeFalsy();
  });
});
