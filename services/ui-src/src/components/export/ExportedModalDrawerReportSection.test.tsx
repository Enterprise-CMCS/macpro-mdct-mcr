import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ExportedModalDrawerReportSection } from "components";
// utils
import {
  mockModalDrawerReportPageJson,
  mockEmptyReportStore,
  mockMcparReportStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// types
import { ModalDrawerReportPageShape } from "types";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockMcparReportStore,
});

const exportedReportSectionComponent = (
  content: ModalDrawerReportPageShape = mockModalDrawerReportPageJson
) => <ExportedModalDrawerReportSection section={content} />;

describe("ExportedModalDrawerReportSection renders", () => {
  test("ExportedModalDrawerReportSection renders", () => {
    const { getByTestId } = render(exportedReportSectionComponent());
    const section = getByTestId("exportedModalDrawerReportSection");
    expect(section).toBeVisible();
  });
});

describe("ExportedModalDrawerReportSection displays correct verbiage if no entities are present", () => {
  test("Correct message is shown if entityType is accessMeasures", () => {
    mockedUseStore.mockReturnValue({
      ...mockEmptyReportStore,
    });
    render(
      exportedReportSectionComponent({
        ...mockModalDrawerReportPageJson,
        entityType: "accessMeasures",
      })
    );
    const entityMessage = screen.getByText("0 - No access measures entered");
    expect(entityMessage).toBeVisible();
  });

  test("Correct message is shown if entityType is qualityMeasures", () => {
    render(
      exportedReportSectionComponent({
        ...mockModalDrawerReportPageJson,
        entityType: "qualityMeasures",
      })
    );
    const entityMessage = screen.getByText(
      "0 - No quality & performance measures entered"
    );
    expect(entityMessage).toBeVisible();
  });

  test("Correct message is shown if entityType is sanctions", () => {
    render(
      exportedReportSectionComponent({
        ...mockModalDrawerReportPageJson,
        entityType: "sanctions",
      })
    );
    const entityMessage = screen.getByText("0 - No sanctions entered");
    expect(entityMessage).toBeVisible();
  });
});

describe("Test ExportedModalDrawerReportSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportedReportSectionComponent());
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
