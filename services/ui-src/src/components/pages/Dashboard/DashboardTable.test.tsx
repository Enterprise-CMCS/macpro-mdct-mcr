import { getStatus } from "./DashboardTable";
describe("Test getStatus utility", () => {
  test("should render the correct status if report has been unlocked", () => {
    expect(getStatus("In progress", false, 1)).toBe("In revision");
  });
  test("should render the correct status if report has been unlocked", () => {
    expect(getStatus("In progress", false, 0)).toBe("In progress");
  });
  test("should render the correct status if report has been archived", () => {
    expect(getStatus("In progress", true, 1)).toBe("Archived");
  });
  test("should render the correct status if report has been unlocked", () => {
    expect(getStatus("Submitted", false, 1)).toBe("Submitted");
  });

  test("should render the correct status if report has been unlocked", () => {
    expect(getStatus("Not started", false, 1)).toBe("In revision");
  });
});
