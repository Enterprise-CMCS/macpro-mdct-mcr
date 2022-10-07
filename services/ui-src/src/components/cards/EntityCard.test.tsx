import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// components
import { EntityCard } from "components";
import { mockModalForm } from "utils/testing/setupJest";

const openDeleteEntityModal = jest.fn();

const mockEntity = {
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

const mockModalData = {
  addTitle: "mock-add-title",
  editTitle: "mock-edit-title",
  message: "mock-message",
  form: mockModalForm,
};

const EntityCardComponent = (
  <EntityCard
    entity={mockEntity}
    entityType="accessMeasures"
    modalData={mockModalData}
    openDeleteEntityModal={openDeleteEntityModal}
    data-testid="mock-entity-card"
  />
);

describe("Test EntityCard", () => {
  beforeEach(() => {
    render(EntityCardComponent);
  });

  test("EntityCard is visible", () => {
    expect(screen.getByTestId("mock-entity-card")).toBeVisible();
  });

  test("Clicking 'Edit measure' button opens the AddEditProgramModal", async () => {
    const editMeasureButton = screen.getByText("Edit measure");
    expect(editMeasureButton).toBeVisible();
    await userEvent.click(editMeasureButton);
    await expect(screen.getByTestId("add-edit-entity-form")).toBeVisible();
  });

  test("EntityCard opens the delete modal on remove click", async () => {
    expect(screen.getByTestId("mock-entity-card")).toBeVisible();
    const removeButton = screen.queryAllByTestId("deleteEntityButton")[0];
    await userEvent.click(removeButton);
    expect(openDeleteEntityModal).toBeCalledTimes(1);
  });
});

describe("Test EntityCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(EntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
