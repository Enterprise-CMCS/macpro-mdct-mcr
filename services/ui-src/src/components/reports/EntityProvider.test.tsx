import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { useStore } from "utils";
import {
  mockEntityStore,
  mockMcparReportStore,
} from "utils/testing/mockZustand";
import { EntityContext, EntityProvider } from "./EntityProvider";

const testEntities = { ...mockEntityStore.selectedEntity };

const testEntitiesUpdated = [
  {
    id: "mock-id",
    type: "plans",
    test: "update",
  },
];

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockEntityStore);

const TestComponent = () => {
  const { prepareEntityPayload } = useContext(EntityContext);

  return (
    <div>
      <button onClick={() => prepareEntityPayload({ test: "update" })}>
        Update Entities
      </button>
      <p id="entities">{JSON.stringify(mockEntityStore.selectedEntity)}</p>
    </div>
  );
};

const testComponent = (
  <EntityProvider>
    <TestComponent />
  </EntityProvider>
);

const testComponentNoEntity = (
  <EntityProvider>
    <TestComponent />
  </EntityProvider>
);

describe("Test update entities provider function", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockMcparReportStore);
    mockedUseStore.mockReturnValue(mockEntityStore);
  });
  test("Should update entities if the selected entity is valid", async () => {
    const result = await render(testComponent);
    expect(
      await result.container.querySelector("[id='entities']")?.innerHTML
    ).toMatch(JSON.stringify(testEntities));
    const updateButton = await result.findByText("Update Entities");
    await userEvent.click(updateButton);

    setTimeout(async () => {
      expect(
        await result.container.querySelector("[id='entities']")?.innerHTML
      ).toMatch(JSON.stringify(testEntitiesUpdated));
    }, 500);
  });

  test("Should do nothing if the selected entity is not set", async () => {
    const result = render(testComponentNoEntity);
    expect(
      await result.container.querySelector("[id='entities']")?.innerHTML
    ).toMatch(JSON.stringify(testEntities));
    const updateButton = await result.findByText("Update Entities");
    await userEvent.click(updateButton);

    setTimeout(async () => {
      expect(
        await result.container.querySelector("[id='entities']")?.innerHTML
      ).toMatch(JSON.stringify(testEntities));
    }, 500);
  });
});
