import { render, screen } from "@testing-library/react";
// components
import { ReportDrawerDetails } from "components";
// utils
import {
  mockUnfinishedAccessMeasuresFormattedEntityData,
  mockUnfinishedQualityMeasuresFormattedEntityData,
  mockUnfinishedSanctionsFormattedEntityData,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
import { EntityType } from "types";

const ReportDrawerDetailsAccessMeasuresComponent = (
  <ReportDrawerDetails
    drawerDetails={mockUnfinishedAccessMeasuresFormattedEntityData}
    entityType={EntityType.ACCESS_MEASURES}
  />
);

const ReportDrawerDetailsSanctionsComponent = (
  <ReportDrawerDetails
    drawerDetails={mockUnfinishedSanctionsFormattedEntityData}
    entityType={EntityType.SANCTIONS}
  />
);

const ReportDrawerDetailsQualityMeasuresComponent = (
  <ReportDrawerDetails
    drawerDetails={mockUnfinishedQualityMeasuresFormattedEntityData}
    entityType={EntityType.QUALITY_MEASURES}
  />
);

const ReportDrawerDetailsInvalidEntityTypeComponent = (
  <ReportDrawerDetails
    drawerDetails={{}}
    entityType={EntityType.BSS_ENTITIES}
  />
);

describe("<ReportDrawerDetails />", () => {
  describe("Test ReportDrawerDetails renders given text", () => {
    test("Should render access measures text provided in drawerDetails", async () => {
      render(ReportDrawerDetailsAccessMeasuresComponent);
      expect(
        screen.getByText(
          mockUnfinishedAccessMeasuresFormattedEntityData.category
        )
      ).toBeVisible();
    });

    test("Should render sanctions text provided in drawerDetails", async () => {
      render(ReportDrawerDetailsSanctionsComponent);
      expect(
        screen.getByText(
          mockUnfinishedSanctionsFormattedEntityData.interventionTopic
        )
      ).toBeVisible();
    });

    test("Should render quality measures text provided in drawerDetails", async () => {
      render(ReportDrawerDetailsQualityMeasuresComponent);
      expect(
        screen.getByText(
          mockUnfinishedQualityMeasuresFormattedEntityData.domain
        )
      ).toBeVisible();
      expect(
        screen.getByText(mockUnfinishedQualityMeasuresFormattedEntityData.name)
      ).toBeVisible();
    });
  });

  describe("Test ReportDrawerDetails invalid entity type", () => {
    test("Renders invalid entity type as 'entity type'", () => {
      render(ReportDrawerDetailsInvalidEntityTypeComponent);
      expect(screen.getByText("bssEntities")).toBeVisible();
    });
  });

  testA11yAct(ReportDrawerDetailsAccessMeasuresComponent);
  testA11yAct(ReportDrawerDetailsSanctionsComponent);
  testA11yAct(ReportDrawerDetailsQualityMeasuresComponent);
  testA11yAct(ReportDrawerDetailsInvalidEntityTypeComponent);
});
