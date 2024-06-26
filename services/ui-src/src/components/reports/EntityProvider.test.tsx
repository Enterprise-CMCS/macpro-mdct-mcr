import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext, useEffect } from "react";
import { EntityContext, EntityProvider } from "./EntityProvider";

const testEntities = [
  {
    id: "foo",
  },
  {
    id: "bar",
  },
];

const testEntitiesUpdated = [
  {
    id: "foo",
    test: "update",
  },
  {
    id: "bar",
  },
];

interface Props {
  noEntity?: boolean;
}

const TestComponent = (props: Props) => {
  const { entities, setEntities, updateEntities, setSelectedEntity } =
    useContext(EntityContext);

  useEffect(() => {
    setEntities(testEntities);
    if (!props.noEntity) {
      setSelectedEntity({ id: "foo" });
    }
  }, [setEntities, setSelectedEntity]);

  return (
    <div>
      <button onClick={() => updateEntities({ test: "update" })}>
        Update Entities
      </button>
      <p id="entities">{JSON.stringify(entities)}</p>
      <p>{entities.length}</p>
    </div>
  );
};

const testComponent = (
  <EntityProvider>
    <TestComponent noEntity={false} />
  </EntityProvider>
);

const testComponentNoEntity = (
  <EntityProvider>
    <TestComponent noEntity={true} />
  </EntityProvider>
);

describe("Test update entities provider function", () => {
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
