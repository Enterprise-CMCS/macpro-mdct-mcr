import { ReportPageShapeBase } from "types";
import { getPageTitle } from "./pageTitles";

const mockDefaultRoute: ReportPageShapeBase = {
  name: "Topic I. Mock route name",
  path: "/mock-route",
  verbiage: {
    intro: {
      section: "Mock section",
    },
  },
};

const mockStateLevelRoute: ReportPageShapeBase = {
  name: "Topic I: Mock route name",
  path: "/mock-route/state-level-indicators",
  verbiage: {
    intro: {
      section: "Mock section",
    },
  },
};

describe("Test pageTitles", () => {
  test("Test default page title", () => {
    const pageTitle = getPageTitle("MCPAR", mockDefaultRoute);
    expect(pageTitle).toBe("Mock route name - MCPAR - MCR");
  });

  test("Test for State-Level indicators (MCPAR)", () => {
    const pageTitle = getPageTitle("MCPAR", mockStateLevelRoute);
    expect(pageTitle).toBe("State-Level Mock route name - MCPAR - MCR");
  });
});
