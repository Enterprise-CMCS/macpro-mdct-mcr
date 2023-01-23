import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// components
import { EntityCard, EntityCardBottomSection } from "components";
import {
  mockModalDrawerReportPageJson,
  mockAccessMeasuresEntity,
  mockUnfinishedAccessMeasuresFormattedEntityData,
  mockCompletedAccessMeasuresFormattedEntityData,
  mockSanctionsEntity,
  mockUnfinishedSanctionsFormattedEntityData,
  mockCompletedSanctionsFormattedEntityData,
  mockQualityMeasuresEntity,
  mockQualityMeasuresFormattedEntityData,
  mockHalfCompletedQualityMeasuresEntity,
  mockHalfCompletedQualityMeasuresFormattedEntityData,
  mockCompletedQualityMeasuresEntity,
  mockCompletedQualityMeasuresFormattedEntityData,
} from "utils/testing/setupJest";

const openAddEditEntityModal = jest.fn();
const openDeleteEntityModal = jest.fn();
const mockOpenDrawer = jest.fn();

const {
  editEntityButtonText,
  enterEntityDetailsButtonText,
  editEntityDetailsButtonText,
} = mockModalDrawerReportPageJson.verbiage;

// ACCESS MEASURES

const UnfinishedAccessMeasuresEntityCardComponent = (
  <EntityCard
    entity={mockAccessMeasuresEntity}
    entityType="mock-entity-type"
    formattedEntityData={mockUnfinishedAccessMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
    printVersion={false}
  />
);

const UnfinishedAccessMeasuresEntityCardPrintComponent = (
  <EntityCard
    entity={mockAccessMeasuresEntity}
    entityType="mock-entity-type"
    formattedEntityData={mockUnfinishedAccessMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
    printVersion={true}
  />
);

const AccessMeasuresEntityCardComponent = (
  <EntityCard
    entity={mockAccessMeasuresEntity}
    entityType="accessMeasures"
    formattedEntityData={mockCompletedAccessMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
    printVersion={false}
  />
);

const AccessMeasuresEntityCardPrintComponent = (
  <EntityCard
    entity={mockAccessMeasuresEntity}
    entityType="accessMeasures"
    formattedEntityData={mockCompletedAccessMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
    printVersion={true}
  />
);

describe("Test Completed AccessMeasures EntityCard", () => {
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

describe("Test Unfinished AccessMeasures EntityCard", () => {
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

describe("Test AccessMeasures EntityCard accessibility", () => {
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
});

describe("Test Completed Print Version EntityCard", () => {
  beforeEach(() => {
    render(AccessMeasuresEntityCardPrintComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
  beforeEach(() => {
    render(UnfinishedAccessMeasuresEntityCardPrintComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("EntityCard in print version displays error", () => {
    expect(screen.getByText("Error")).toBeVisible();
  });
});

// QUALITY MEASURES

const UnstartedQualityMeasuresEntityCardComponent = (
  <EntityCard
    entity={mockQualityMeasuresEntity}
    entityType="qualityMeasures"
    formattedEntityData={mockQualityMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

const HalfCompletedQualityMeasuresEntityCardComponent = (
  <EntityCard
    entity={mockHalfCompletedQualityMeasuresEntity}
    entityType="qualityMeasures"
    formattedEntityData={mockHalfCompletedQualityMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

const CompletedQualityMeasuresEntityCardComponent = (
  <EntityCard
    entity={mockCompletedQualityMeasuresEntity}
    entityType="qualityMeasures"
    formattedEntityData={mockCompletedQualityMeasuresFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

describe("Test Unstarted QualityMeasures EntityCard", () => {
  beforeEach(() => {
    render(UnstartedQualityMeasuresEntityCardComponent);
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

describe("Test half-completed QualityMeasures EntityCard", () => {
  beforeEach(() => {
    render(HalfCompletedQualityMeasuresEntityCardComponent);
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
});

describe("Test completed QualityMeasures EntityCard", () => {
  beforeEach(() => {
    render(CompletedQualityMeasuresEntityCardComponent);
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
});

describe("Test QualityMeasures EntityCard accessibility", () => {
  it("Unstarted QualityMeasures EntityCard should not have basic accessibility issues", async () => {
    const { container } = render(UnstartedQualityMeasuresEntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Half-completed QualityMeasures EntityCard should not have basic accessibility issues", async () => {
    const { container } = render(
      HalfCompletedQualityMeasuresEntityCardComponent
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Completed QualityMeasures EntityCard should not have basic accessibility issues", async () => {
    const { container } = render(CompletedQualityMeasuresEntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// SANCTIONS

const UnfinishedSanctionsEntityCardComponent = (
  <EntityCard
    entity={mockSanctionsEntity}
    entityType="sanctions"
    formattedEntityData={mockUnfinishedSanctionsFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

const SanctionsEntityCardComponent = (
  <EntityCard
    entity={mockSanctionsEntity}
    entityType="sanctions"
    formattedEntityData={mockCompletedSanctionsFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

describe("Test Completed Sanctions EntityCard", () => {
  beforeEach(() => {
    render(SanctionsEntityCardComponent);
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

describe("Test Unfinished Sanctions EntityCard", () => {
  beforeEach(() => {
    render(UnfinishedSanctionsEntityCardComponent);
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

describe("Test Sanctions EntityCard accessibility", () => {
  it("Unfinished Sanctions EntityCard should not have basic accessibility issues", async () => {
    const { container } = render(UnfinishedSanctionsEntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Completed Sanctions EntityCard should not have basic accessibility issues", async () => {
    const { container } = render(SanctionsEntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Undefined EntityType

const UndefinedEntityCardBottomSection = (
  <EntityCardBottomSection
    entityType={"Undefined Entity Type"}
    formattedEntityData={mockUnfinishedAccessMeasuresFormattedEntityData}
  />
);

describe("Should return Entity Type by default", () => {
  it("should return the entity type given", () => {
    render(UndefinedEntityCardBottomSection);
    expect(screen.queryByText("Undefined Entity Type")).toBeTruthy();
  });
});
