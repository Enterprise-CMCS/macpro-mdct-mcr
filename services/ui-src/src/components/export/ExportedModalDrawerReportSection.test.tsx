import { render, screen } from "@testing-library/react";
// components
import { ExportedModalDrawerReportSection } from "components";
// types
import { EntityType, ModalDrawerReportPageShape } from "types";
// utils
import {
  mockModalDrawerReportPageJson,
  mockEmptyReportStore,
  mockMcparReportStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockMcparReportStore,
});

const exportedReportSectionComponent = (
  content: ModalDrawerReportPageShape = mockModalDrawerReportPageJson
) => <ExportedModalDrawerReportSection section={content} />;

describe("<ExportedModalDrawerReportSection />", () => {
  test("ExportedModalDrawerReportSection renders", () => {
    const { getByTestId } = render(exportedReportSectionComponent());
    const section = getByTestId("exportedModalDrawerReportSection");
    expect(section).toBeVisible();
  });

  describe("ExportedModalDrawerReportSection displays correct verbiage if no entities are present", () => {
    test("Correct message is shown if entityType is accessMeasures", () => {
      mockedUseStore.mockReturnValue({
        ...mockEmptyReportStore,
      });
      render(
        exportedReportSectionComponent({
          ...mockModalDrawerReportPageJson,
          entityType: EntityType.ACCESS_MEASURES,
        })
      );
      const entityMessage = screen.getByText("0 - No access measures entered");
      expect(entityMessage).toBeVisible();
    });

    test("Correct message is shown if entityType is qualityMeasures", () => {
      render(
        exportedReportSectionComponent({
          ...mockModalDrawerReportPageJson,
          entityType: EntityType.QUALITY_MEASURES,
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
          entityType: EntityType.SANCTIONS,
        })
      );
      const entityMessage = screen.getByText("0 - No sanctions entered");
      expect(entityMessage).toBeVisible();
    });
  });
  testA11yAct(exportedReportSectionComponent());
});
