import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { EntityCard, EntityCardBottomSection } from "components";
// utils
import {
  mockModalDrawerReportPageJson,
  mockAccessMeasuresEntity,
  mockUnfinishedAccessMeasuresFormattedEntityData,
  mockCompletedAccessMeasuresFormattedEntityData,
  mockSanctionsEntity,
  mockUnfinishedSanctionsFormattedEntityData,
  mockCompletedSanctionsFormattedEntityData,
  mockQualityMeasuresEntity,
  mockUnfinishedQualityMeasuresFormattedEntityData,
  mockCompletedQualityMeasuresEntity,
  mockCompletedQualityMeasuresFormattedEntityData,
  mockQualityMeasuresEntityMissingReportingPeriodAndDetails,
  mockQualityMeasuresFormattedEntityDataMissingReportingPeriodAndDetails,
  mockQualityMeasuresEntityMissingReportingPeriod,
  mockQualityMeasuresFormattedEntityDataMissingReportingPeriod,
  mockQualityMeasuresEntityMissingDetails,
  mockQualityMeasuresFormattedEntityDataMissingDetails,
  mockMcparReportStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import { EntityType } from "types";

const openAddEditEntityModal = jest.fn();
const openDeleteEntityModal = jest.fn();
const mockOpenDrawer = jest.fn();

const {
  editEntityButtonText,
  enterEntityDetailsButtonText,
  editEntityDetailsButtonText,
} = mockModalDrawerReportPageJson.verbiage;

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockMcparReportStore,
});

// ACCESS MEASURES

const UnfinishedAccessMeasuresEntityCardComponent = (
  <EntityCard
    entity={mockAccessMeasuresEntity}
    entityIndex={0}
    entityType={"mock-entity-type" as EntityType}
    formattedEntityData={mockUnfinishedAccessMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openOverlayOrDrawer={mockOpenDrawer}
    printVersion={false}
  />
);

const UnfinishedAccessMeasuresEntityCardPrintComponent = (
  <EntityCard
    entity={mockAccessMeasuresEntity}
    entityIndex={0}
    entityType={"mock-entity-type" as EntityType}
    formattedEntityData={mockUnfinishedAccessMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openOverlayOrDrawer={mockOpenDrawer}
    printVersion={true}
  />
);

const AccessMeasuresEntityCardComponent = (
  formattedEntityData = mockCompletedAccessMeasuresFormattedEntityData
) => (
  <EntityCard
    entity={mockAccessMeasuresEntity}
    entityIndex={0}
    entityType={EntityType.ACCESS_MEASURES}
    formattedEntityData={formattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openOverlayOrDrawer={mockOpenDrawer}
    printVersion={false}
  />
);

const AccessMeasuresEntityCardPrintComponent = (
  <EntityCard
    entity={mockAccessMeasuresEntity}
    entityIndex={0}
    entityType={EntityType.ACCESS_MEASURES}
    formattedEntityData={mockCompletedAccessMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openOverlayOrDrawer={mockOpenDrawer}
    printVersion={true}
  />
);

// QUALITY MEASURES

const UnstartedQualityMeasuresEntityCardComponent = (
  <EntityCard
    entity={mockQualityMeasuresEntity}
    entityIndex={0}
    entityType={EntityType.QUALITY_MEASURES}
    formattedEntityData={mockUnfinishedQualityMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openOverlayOrDrawer={mockOpenDrawer}
  />
);

const QualityMeasuresEntityCardComponentMissingReportingPeriodAndDetails = (
  <EntityCard
    entity={mockQualityMeasuresEntityMissingReportingPeriodAndDetails}
    entityIndex={0}
    entityType={EntityType.QUALITY_MEASURES}
    formattedEntityData={
      mockQualityMeasuresFormattedEntityDataMissingReportingPeriodAndDetails
    }
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openOverlayOrDrawer={mockOpenDrawer}
  />
);

const QualityMeasuresEntityCardComponentMissingReportingPeriod = (
  <EntityCard
    entity={mockQualityMeasuresEntityMissingReportingPeriod}
    entityIndex={0}
    entityType={EntityType.QUALITY_MEASURES}
    formattedEntityData={
      mockQualityMeasuresFormattedEntityDataMissingReportingPeriod
    }
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openOverlayOrDrawer={mockOpenDrawer}
  />
);

const QualityMeasuresEntityCardComponentMissingDetails = (
  <EntityCard
    entity={mockQualityMeasuresEntityMissingDetails}
    entityIndex={0}
    entityType={EntityType.QUALITY_MEASURES}
    formattedEntityData={mockQualityMeasuresFormattedEntityDataMissingDetails}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openOverlayOrDrawer={mockOpenDrawer}
  />
);

const CompletedQualityMeasuresEntityCardComponent = (
  <EntityCard
    entity={mockCompletedQualityMeasuresEntity}
    entityIndex={0}
    entityType={EntityType.QUALITY_MEASURES}
    formattedEntityData={mockCompletedQualityMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openOverlayOrDrawer={mockOpenDrawer}
  />
);

// SANCTIONS

const UnfinishedSanctionsEntityCardComponent = (
  <EntityCard
    entity={mockSanctionsEntity}
    entityIndex={0}
    entityType={EntityType.SANCTIONS}
    formattedEntityData={mockUnfinishedSanctionsFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openOverlayOrDrawer={mockOpenDrawer}
  />
);

const SanctionsEntityCardComponent = (
  <EntityCard
    entity={mockSanctionsEntity}
    entityIndex={0}
    entityType={EntityType.SANCTIONS}
    formattedEntityData={mockCompletedSanctionsFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openOverlayOrDrawer={mockOpenDrawer}
  />
);

// Undefined EntityType

const UndefinedEntityCardBottomSection = (
  <EntityCardBottomSection
    entityType={"Undefined Entity Type" as EntityType}
    formattedEntityData={mockUnfinishedAccessMeasuresFormattedEntityData}
  />
);

describe("<EntityCard />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Test Completed AccessMeasures EntityCard", () => {
    beforeEach(() => {
      render(AccessMeasuresEntityCardComponent());
    });
    test("EntityCard is visible", () => {
      expect(screen.getByTestId("entityCard")).toBeVisible();
    });

    test("Clicking edit button opens the AddEditProgramModal", async () => {
      const editEntityButton = screen.getByText(editEntityButtonText);
      await act(async () => {
        await userEvent.click(editEntityButton);
      });
      await expect(openAddEditEntityModal).toBeCalledTimes(1);
    });

    test("EntityCard opens the delete modal on remove click", async () => {
      const removeButton = screen.getByTestId("delete-entity-button");
      await act(async () => {
        await userEvent.click(removeButton);
      });
      expect(openDeleteEntityModal).toBeCalledTimes(1);
    });

    test("EntityCard opens the drawer on edit-details click", async () => {
      const editDetailsButton = screen.getByText(editEntityDetailsButtonText);
      await act(async () => {
        await userEvent.click(editDetailsButton);
      });
      expect(mockOpenDrawer).toBeCalledTimes(1);
    });
  });

  describe("Test Completed AccessMeasures EntityCard with provider details", () => {
    test("provider details are in the card", () => {
      const formattedEntityData = {
        ...mockCompletedAccessMeasuresFormattedEntityData,
        providerDetails: "mock-provider-details",
      };
      render(AccessMeasuresEntityCardComponent(formattedEntityData));
      expect(
        screen.getByText(
          `${formattedEntityData.provider}: mock-provider-details`
        )
      ).toBeVisible();
    });
  });

  describe("Test Unfinished AccessMeasures EntityCard", () => {
    beforeEach(() => {
      render(UnfinishedAccessMeasuresEntityCardComponent);
    });

    test("EntityCard is visible", () => {
      expect(screen.getByTestId("entityCard")).toBeVisible();
    });

    test("EntityCard opens the delete modal on remove click", async () => {
      const removeButton = screen.getByTestId("delete-entity-button");
      await act(async () => {
        await userEvent.click(removeButton);
      });
      expect(openDeleteEntityModal).toBeCalledTimes(1);
    });

    test("EntityCard opens the drawer on enter-details click", async () => {
      const enterDetailsButton = screen.getByText(enterEntityDetailsButtonText);
      await act(async () => {
        await userEvent.click(enterDetailsButton);
      });
      expect(mockOpenDrawer).toBeCalledTimes(1);
    });
  });

  describe("Test AccessMeasures EntityCard accessibility", () => {
    testA11yAct(UnfinishedAccessMeasuresEntityCardComponent);
    testA11yAct(AccessMeasuresEntityCardComponent());
  });

  describe("Test Completed Print Version EntityCard", () => {
    beforeEach(() => {
      render(AccessMeasuresEntityCardPrintComponent);
    });
    test("EntityCard in print version displays entity count", () => {
      expect(screen.getByTestId("entities-count")).toBeVisible();
    });

    test("EntityCard in print version displays print version status indicator", () => {
      expect(screen.getByTestId("print-status-indicator")).toBeVisible();
    });

    test("Finished EntityCard in print version displays completed ", () => {
      expect(screen.getByText("Complete")).toBeVisible();
    });
  });

  describe("Test Uncompleted Print Version EntityCard", () => {
    test("EntityCard in print version displays error", () => {
      render(UnfinishedAccessMeasuresEntityCardPrintComponent);
      expect(screen.getByText("Error")).toBeVisible();
    });
  });

  describe("Test EntityCard status indicators for AccessMeasures", () => {
    test("Correct indicators for unfinished access measure", () => {
      render(UnfinishedAccessMeasuresEntityCardComponent);
      // status icon alt text should indicate incompleteness
      expect(screen.queryByAltText("entity is incomplete")).toBeTruthy();

      // Access measures do not have reporting periods, so their metadata is always complete
      expect(
        screen.queryByText("Mock entity missing reporting period message")
      ).toBeFalsy();

      // This message shows for entities with partial details; this entity isn't even started
      expect(
        screen.queryByText("Mock entity missing response message")
      ).toBeFalsy();
      expect(
        screen.queryByText("Mock entity unfinished messsage")
      ).toBeTruthy();

      // There are no details yet, so they cannot be EDITed
      expect(
        screen.queryByText("Mock edit entity details button text")
      ).toBeFalsy();
      expect(
        screen.queryByText("Mock enter entity details button text")
      ).toBeTruthy();
    });

    test("Correct indicators for completed access measure", () => {
      render(AccessMeasuresEntityCardComponent());

      // status icon alt text should indicate incompleteness
      expect(screen.queryByAltText("entity is incomplete")).toBeFalsy();

      expect(
        screen.queryByText("Mock entity missing reporting period message")
      ).toBeFalsy();

      expect(
        screen.queryByText("Mock entity missing response message")
      ).toBeFalsy();
      expect(screen.queryByText("Mock entity unfinished messsage")).toBeFalsy();

      // The details are complete but they can still be EDITed
      expect(
        screen.queryByText("Mock edit entity details button text")
      ).toBeTruthy();
      expect(
        screen.queryByText("Mock enter entity details button text")
      ).toBeFalsy();
    });
  });

  describe("Test Unstarted QualityMeasures EntityCard", () => {
    beforeEach(() => {
      render(UnstartedQualityMeasuresEntityCardComponent);
    });

    test("EntityCard is visible", () => {
      expect(screen.getByTestId("entityCard")).toBeVisible();
    });

    test("EntityCard opens the delete modal on remove click", async () => {
      const removeButton = screen.getByTestId("delete-entity-button");
      await act(async () => {
        await userEvent.click(removeButton);
      });
      expect(openDeleteEntityModal).toBeCalledTimes(1);
    });

    test("EntityCard opens the drawer on enter-details click", async () => {
      const enterDetailsButton = screen.getByText(enterEntityDetailsButtonText);
      await act(async () => {
        await userEvent.click(enterDetailsButton);
      });
      expect(mockOpenDrawer).toBeCalledTimes(1);
    });
  });

  describe("Test QualityMeasures EntityCard with missing details", () => {
    beforeEach(() => {
      render(QualityMeasuresEntityCardComponentMissingDetails);
    });

    test("EntityCard is visible", () => {
      expect(screen.getByTestId("entityCard")).toBeVisible();
    });

    test("Clicking edit button opens the AddEditProgramModal", async () => {
      const editEntityButton = screen.getByText(editEntityButtonText);
      await act(async () => {
        await userEvent.click(editEntityButton);
      });
      await expect(openAddEditEntityModal).toBeCalledTimes(1);
    });

    test("EntityCard opens the delete modal on remove click", async () => {
      const removeButton = screen.getByTestId("delete-entity-button");
      await act(async () => {
        await userEvent.click(removeButton);
      });
      expect(openDeleteEntityModal).toBeCalledTimes(1);
    });
  });

  describe("Test completed QualityMeasures EntityCard", () => {
    beforeEach(() => {
      render(CompletedQualityMeasuresEntityCardComponent);
    });

    test("EntityCard is visible", () => {
      expect(screen.getByTestId("entityCard")).toBeVisible();
    });

    test("Clicking edit button opens the AddEditProgramModal", async () => {
      const editEntityButton = screen.getByText(editEntityButtonText);
      await act(async () => {
        await userEvent.click(editEntityButton);
      });
      await expect(openAddEditEntityModal).toBeCalledTimes(1);
    });

    test("EntityCard opens the delete modal on remove click", async () => {
      const removeButton = screen.getByTestId("delete-entity-button");
      await act(async () => {
        await userEvent.click(removeButton);
      });
      expect(openDeleteEntityModal).toBeCalledTimes(1);
    });
  });

  describe("Test EntityCard status indicators for QualityMeasures", () => {
    test("Correct indicators for quality measure which has not been started", () => {
      render(UnstartedQualityMeasuresEntityCardComponent);
      // status icon alt text should indicate incompleteness
      expect(screen.queryByAltText("entity is incomplete")).toBeTruthy();

      // This quality measure was just created from scratch, so it has a reporting period
      expect(
        screen.queryByText("Mock entity missing reporting period message")
      ).toBeFalsy();

      // This message shows for entities with partial details; this entity isn't even started
      expect(
        screen.queryByText("Mock entity missing response message")
      ).toBeFalsy();
      expect(
        screen.queryByText("Mock entity unfinished messsage")
      ).toBeTruthy();

      // There are no details yet, so they cannot be EDITed
      expect(
        screen.queryByText("Mock edit entity details button text")
      ).toBeFalsy();
      expect(
        screen.queryByText("Mock enter entity details button text")
      ).toBeTruthy();
    });

    test("Correct indicators for quality measure without reporting period", () => {
      render(QualityMeasuresEntityCardComponentMissingReportingPeriod);

      // status icon alt text should indicate incompleteness
      expect(screen.queryByAltText("entity is incomplete")).toBeTruthy();

      expect(
        screen.queryByText("Mock entity missing reporting period message")
      ).toBeTruthy();

      expect(
        screen.queryByText("Mock entity missing response message")
      ).toBeFalsy();
      expect(screen.queryByText("Mock entity unfinished messsage")).toBeFalsy();

      // The details are complete but they can still be EDITed
      expect(
        screen.queryByText("Mock edit entity details button text")
      ).toBeTruthy();
      expect(
        screen.queryByText("Mock enter entity details button text")
      ).toBeFalsy();
    });

    test("Correct indicators for quality measure with neither reporting period nor details", () => {
      render(
        QualityMeasuresEntityCardComponentMissingReportingPeriodAndDetails
      );
      expect(screen.queryByAltText("entity is incomplete")).toBeTruthy();

      expect(
        screen.queryByText("Mock entity missing reporting period message")
      ).toBeTruthy();

      expect(
        screen.queryByText("Mock entity missing response message")
      ).toBeTruthy();
      expect(screen.queryByText("Mock entity unfinished messsage")).toBeFalsy();

      expect(
        screen.queryByText("Mock edit entity details button text")
      ).toBeFalsy();
      expect(
        screen.queryByText("Mock enter entity details button text")
      ).toBeTruthy();
    });

    test("Correct indicators for quality measures without details", () => {
      render(QualityMeasuresEntityCardComponentMissingDetails);
      expect(screen.queryByAltText("entity is incomplete")).toBeTruthy();

      expect(
        screen.queryByText("Mock entity missing reporting period message")
      ).toBeFalsy();

      expect(
        screen.queryByText("Mock entity missing response message")
      ).toBeTruthy();
      expect(screen.queryByText("Mock entity unfinished messsage")).toBeFalsy();

      expect(
        screen.queryByText("Mock edit entity details button text")
      ).toBeFalsy();
      expect(
        screen.queryByText("Mock enter entity details button text")
      ).toBeTruthy();
    });

    test("Correct indicators for quality measure which is complete", () => {
      render(CompletedQualityMeasuresEntityCardComponent);
      expect(screen.queryByAltText("entity is incomplete")).toBeFalsy();

      expect(
        screen.queryByText("Mock entity missing reporting period message")
      ).toBeFalsy();

      expect(
        screen.queryByText("Mock entity missing response message")
      ).toBeFalsy();
      expect(screen.queryByText("Mock entity unfinished messsage")).toBeFalsy();

      expect(
        screen.queryByText("Mock edit entity details button text")
      ).toBeTruthy();
      expect(
        screen.queryByText("Mock enter entity details button text")
      ).toBeFalsy();
    });
  });

  describe("Test QualityMeasures EntityCard accessibility", () => {
    testA11yAct(UnstartedQualityMeasuresEntityCardComponent);
    testA11yAct(QualityMeasuresEntityCardComponentMissingDetails, () => {
      mockedUseStore.mockReturnValue({
        ...mockMcparReportStore,
      });
    });
    testA11yAct(CompletedQualityMeasuresEntityCardComponent);
  });

  describe("Test Completed Sanctions EntityCard", () => {
    beforeEach(() => {
      render(SanctionsEntityCardComponent);
    });

    test("EntityCard is visible", () => {
      expect(screen.getByTestId("entityCard")).toBeVisible();
    });

    test("Clicking edit button opens the AddEditProgramModal", async () => {
      const editEntityButton = screen.getByText(editEntityButtonText);
      await act(async () => {
        await userEvent.click(editEntityButton);
      });
      await expect(openAddEditEntityModal).toBeCalledTimes(1);
    });

    test("EntityCard opens the delete modal on remove click", async () => {
      const removeButton = screen.getByTestId("delete-entity-button");
      await act(async () => {
        await userEvent.click(removeButton);
      });
      expect(openDeleteEntityModal).toBeCalledTimes(1);
    });

    test("EntityCard opens the drawer on edit-details click", async () => {
      const editDetailsButton = screen.getByText(editEntityDetailsButtonText);
      await act(async () => {
        await userEvent.click(editDetailsButton);
      });
      expect(mockOpenDrawer).toBeCalledTimes(1);
    });
  });

  describe("Test Unfinished Sanctions EntityCard", () => {
    beforeEach(() => {
      render(UnfinishedSanctionsEntityCardComponent);
    });

    test("EntityCard is visible", () => {
      expect(screen.getByTestId("entityCard")).toBeVisible();
    });

    test("EntityCard opens the delete modal on remove click", async () => {
      const removeButton = screen.getByTestId("delete-entity-button");
      await act(async () => {
        await userEvent.click(removeButton);
      });
      expect(openDeleteEntityModal).toBeCalledTimes(1);
    });

    test("EntityCard opens the drawer on enter-details click", async () => {
      const enterDetailsButton = screen.getByText(enterEntityDetailsButtonText);
      await act(async () => {
        await userEvent.click(enterDetailsButton);
      });
      expect(mockOpenDrawer).toBeCalledTimes(1);
    });
  });

  describe("Test EntityCard status indicators for Sanctions", () => {
    test("Correct indicators for unfinished sanction card", () => {
      render(UnfinishedSanctionsEntityCardComponent);
      // status icon alt text should indicate incompleteness
      expect(screen.queryByAltText("entity is incomplete")).toBeTruthy();

      // Sanctions do not have reporting periods, so their metadata is always complete
      expect(
        screen.queryByText("Mock entity missing reporting period message")
      ).toBeFalsy();

      // This message shows for entities with partial details; this entity isn't even started
      expect(
        screen.queryByText("Mock entity missing response message")
      ).toBeFalsy();
      expect(
        screen.queryByText("Mock entity unfinished messsage")
      ).toBeTruthy();

      // There are no details yet, so they cannot be EDITed
      expect(
        screen.queryByText("Mock edit entity details button text")
      ).toBeFalsy();
      expect(
        screen.queryByText("Mock enter entity details button text")
      ).toBeTruthy();
    });

    test("Correct indicators for completed sanction", () => {
      render(SanctionsEntityCardComponent);

      // status icon alt text should indicate incompleteness
      expect(screen.queryByAltText("entity is incomplete")).toBeFalsy();

      expect(
        screen.queryByText("Mock entity missing reporting period message")
      ).toBeFalsy();

      expect(
        screen.queryByText("Mock entity missing response message")
      ).toBeFalsy();
      expect(screen.queryByText("Mock entity unfinished messsage")).toBeFalsy();

      // The details are complete but they can still be EDITed
      expect(
        screen.queryByText("Mock edit entity details button text")
      ).toBeTruthy();
      expect(
        screen.queryByText("Mock enter entity details button text")
      ).toBeFalsy();
    });
  });

  describe("Test Sanctions EntityCard accessibility", () => {
    testA11yAct(UnfinishedSanctionsEntityCardComponent);
    testA11yAct(SanctionsEntityCardComponent);
  });

  describe("Should return Entity Type by default", () => {
    test("should return the entity type given", () => {
      render(UndefinedEntityCardBottomSection);
      expect(screen.queryByText("Undefined Entity Type")).toBeTruthy();
    });
  });
});
