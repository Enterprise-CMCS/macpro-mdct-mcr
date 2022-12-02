import { render } from "@testing-library/react";
import { ReportContext } from "components";
import { McparPdfExport } from "./McparPdfExport";

const mockContext = {
  report: {
    dueDate: 1712505600000,
    lastAltered: 1712505600000,
    lastAlteredBy: "Name",
    status: "In Progress",
    programName: "test",
    formTemplate: {
      routes: [
        {
          path: "test",
          name: "test",
          pageType: "test",
          children: ["test"],
        },
      ],
    },
    fieldData: {
      stateName: "test",
    },
  },
};

const mockContextCombinedData = {
  report: {
    dueDate: 1712505600000,
    lastAltered: 1712505600000,
    lastAlteredBy: "Name",
    status: "In Progress",
    programName: "test",
    combinedData: true,
    formTemplate: {
      routes: [
        {
          path: "test",
          name: "test",
          pageType: "test",
          children: ["test"],
        },
      ],
    },
    fieldData: {
      stateName: "test",
    },
  },
};

const mcparPdfExport = (context: any) => (
  <ReportContext.Provider value={context}>
    <McparPdfExport />
  </ReportContext.Provider>
);

describe("Test McparPdfExport Functionality", () => {
  test("Is the export page visible", () => {
    const { getByTestId } = render(mcparPdfExport(mockContext));
    const page = getByTestId("mcparPdfExport");
    expect(page).toBeVisible();
  });
  test("Is the export page visible w/Combined Data", () => {
    const { getByTestId } = render(mcparPdfExport(mockContextCombinedData));
    const page = getByTestId("mcparPdfExport");
    expect(page).toBeVisible();
  });
});
