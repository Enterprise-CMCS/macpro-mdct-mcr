import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// components
import { EntityCard } from "components";
import { mockModalDrawerReportPageJson } from "utils/testing/setupJest";

const openAddEditEntityModal = jest.fn();
const openDeleteEntityModal = jest.fn();
const mockOpenDrawer = jest.fn();

const mockAccessMeasuresEntity = {
  id: "mock-id",
  accessMeasure_generalCategory: [
    {
      key: "option1",
      value: "mock-category",
    },
  ],
  accessMeasure_standardDescription: "mock-description",
  accessMeasure_standardType: [
    {
      key: "option1",
      value: "mock-type",
    },
  ],
  "accessMeasure_standardType-otherText": "",
};

const mockUnfinishedAccessMeasuresFormattedEntityData = {
  category: "mock-category",
  standardDescription: "mock-standardDescription",
  standardType: "mock-standardType",
};

const mockAccessMeasuresFormattedEntityData = {
  ...mockUnfinishedAccessMeasuresFormattedEntityData,
  provider: "mock-providerType",
  region: "mock-applicableRegion",
  population: "mock-population",
  monitoringMethods: ["mock-monitoringMethod-1", "mock-monitoringMethod-2"],
  methodFrequency: "mock-oversightMethodFrequency",
};

const UnfinishedAccessMeasuresEntityCardComponent = (
  <EntityCard
    entity={mockAccessMeasuresEntity}
    entityType="mock-entity-type"
    formattedEntityData={mockUnfinishedAccessMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

const AccessMeasuresEntityCardComponent = (
  <EntityCard
    entity={mockAccessMeasuresEntity}
    entityType="accessMeasures"
    formattedEntityData={mockAccessMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
    data-testid="mock-entity-card"
  />
);

const mockSanctionsEntity = {
  id: "mock-id",
  sanction_interventionType: [
    {
      key: "option1",
      value: "mock-type",
    },
  ],
  sanction_interventionTopic: [
    {
      key: "option1",
      value: "mock-topic",
    },
  ],
  sanction_planName: {
    label: "sanction_planName",
    value: "mock-plan-id",
  },
  sanction_interventionReason: "mock-reason",
  sanction_noncomplianceInstances: "mock-number",
  sanction_dollarAmount: "mock-dollar-amount",
  sanction_date: "mock-date",
  sanction_remediationDate: "mock-date",
  sanction_correctiveActionPlan: [
    {
      key: "option1",
      value: "mock-answer",
    },
  ],
};

const mockUnfinishedSanctionsFormattedEntityData = {
  interventionType: "mock-type",
  interventionTopic: "mock-topic",
  planName: "mock-plan-name",
  interventionReason: "mock-reason",
};

const mockSanctionsFormattedEntityData = {
  ...mockUnfinishedSanctionsFormattedEntityData,
  noncomplianceInstances: "mock-instances",
  dollarAmount: "mock-dollar-amount",
  date: "mock-date",
  remediationDate: "mock-date",
  correctiveActionPlan: "mock-answer",
};

const UnfinishedSanctionsEntityCardComponent = (
  <EntityCard
    entity={mockSanctionsEntity}
    entityType="sanctions"
    formattedEntityData={mockUnfinishedSanctionsFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
    data-testid="mock-entity-card"
  />
);

const SanctionsEntityCardComponent = (
  <EntityCard
    entity={mockSanctionsEntity}
    entityType="sanctions"
    formattedEntityData={mockSanctionsFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
    data-testid="mock-entity-card"
  />
);

// const mockQualityMeasuresEntity = {};

// const mockFormattedQualityMeasuresEntityData = {};

/*
 * const QualityMeasuresEntityCardComponent = (
 *   <EntityCard
 *     entity={mockQualityMeasuresEntity}
 *     entityType="qualityMeasures"
 *     formattedEntityData={mockFormattedQualityMeasuresEntityData}
 *     verbiage={mockModalDrawerReportPageJson.verbiage}
 *     openAddEditEntityModal={openAddEditEntityModal}
 *     openDeleteEntityModal={openDeleteEntityModal}
 *     openDrawer={mockOpenDrawer}
 *     data-testid="mock-entity-card"
 *   />
 * );
 */

const {
  editEntityButtonText,
  enterEntityDetailsButtonText,
  editEntityDetailsButtonText,
} = mockModalDrawerReportPageJson.verbiage;

describe("Test Finished EntityCard", () => {
  beforeEach(() => {
    render(AccessMeasuresEntityCardComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("EntityCard is visible", () => {
    expect(screen.getByTestId("entityCard")).toBeVisible();
  });

  test("Clicking edit button opens the AddEditProgramModal", async () => {
    const editEntityButton = screen.getByText(editEntityButtonText);
    await userEvent.click(editEntityButton);
    await expect(openAddEditEntityModal).toBeCalledTimes(1);
  });

  test("EntityCard opens the delete modal on remove click", async () => {
    const removeButton = screen.getByTestId("delete-entity-button");
    await userEvent.click(removeButton);
    expect(openDeleteEntityModal).toBeCalledTimes(1);
  });

  test("EntityCard opens the drawer on edit-details click", async () => {
    const editDetailsButton = screen.getByText(editEntityDetailsButtonText);
    await userEvent.click(editDetailsButton);
    expect(mockOpenDrawer).toBeCalledTimes(1);
  });
});

describe("Test Unfinished EntityCard", () => {
  beforeEach(() => {
    render(UnfinishedAccessMeasuresEntityCardComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("EntityCard is visible", () => {
    expect(screen.getByTestId("entityCard")).toBeVisible();
  });

  test("EntityCard opens the delete modal on remove click", async () => {
    const removeButton = screen.getByTestId("delete-entity-button");
    await userEvent.click(removeButton);
    expect(openDeleteEntityModal).toBeCalledTimes(1);
  });

  test("EntityCard opens the drawer on enter-details click", async () => {
    const enterDetailsButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(enterDetailsButton);
    expect(mockOpenDrawer).toBeCalledTimes(1);
  });
});

describe("Test EntityCard accessibility", () => {
  it("Unfinished AccessMeasures EntityCard should not have basic accessibility issues", async () => {
    const { container } = render(UnfinishedAccessMeasuresEntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Completed AccessMeasures EntityCard should not have basic accessibility issues", async () => {
    const { container } = render(AccessMeasuresEntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Unfinished Sanctions EntityCard Should not have basic accessibility issues", async () => {
    const { container } = render(UnfinishedSanctionsEntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Completed Sanctions EntityCard should not have basic accessibility issues", async () => {
    const { container } = render(SanctionsEntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /*
   * it("Should not have basic accessibility issues", async () => {
   *   const { container } = render(QualityMeasuresEntityCardComponent);
   *   const results = await axe(container);
   *   expect(results).toHaveNoViolations();
   * });
   */
});
