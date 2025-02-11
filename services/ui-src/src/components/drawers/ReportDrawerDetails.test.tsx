import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
// components
import { ReportDrawerDetails } from "components";
// utils
import {
  mockUnfinishedAccessMeasuresFormattedEntityData,
  mockUnfinishedQualityMeasuresFormattedEntityData,
  mockUnfinishedSanctionsFormattedEntityData,
} from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

const ReportDrawerDetailsAccessMeasuresComponent = (
  <ReportDrawerDetails
    drawerDetails={mockUnfinishedAccessMeasuresFormattedEntityData}
    entityType="accessMeasures"
  />
);

const ReportDrawerDetailsSanctionsComponent = (
  <ReportDrawerDetails
    drawerDetails={mockUnfinishedSanctionsFormattedEntityData}
    entityType="sanctions"
  />
);

const ReportDrawerDetailsQualityMeasuresComponent = (
  <ReportDrawerDetails
    drawerDetails={mockUnfinishedQualityMeasuresFormattedEntityData}
    entityType="qualityMeasures"
  />
);

const ReportDrawerDetailsInvalidEntityTypeComponent = (
  <ReportDrawerDetails drawerDetails={{}} entityType="bssEntities" />
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

  testA11y(ReportDrawerDetailsAccessMeasuresComponent);
  testA11y(ReportDrawerDetailsSanctionsComponent);
  testA11y(ReportDrawerDetailsQualityMeasuresComponent);
  testA11y(ReportDrawerDetailsInvalidEntityTypeComponent);
});
