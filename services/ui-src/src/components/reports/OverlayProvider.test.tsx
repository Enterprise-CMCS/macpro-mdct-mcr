import { useContext } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { OverlayContext, OverlayProvider } from "./OverlayProvider";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const mockChildFormId = "mockId";
const mockSelectedStandard = { count: 1, entity: { name: "Mock" } };

const TestComponent = () => {
  const { childFormId, selectedStandard, setChildFormId, setSelectedStandard } =
    useContext(OverlayContext);

  return (
    <div>
      <button onClick={() => setChildFormId(mockChildFormId)}>
        setChildFormId
      </button>
      {childFormId && <span>Child Form {childFormId}</span>}

      <button onClick={() => setSelectedStandard(mockSelectedStandard)}>
        setSelectedStandard
      </button>
      {selectedStandard && (
        <span>
          {`${selectedStandard.entity.name} ${selectedStandard.count}`}
        </span>
      )}
    </div>
  );
};

const testComponent = (
  <RouterWrappedComponent>
    <OverlayProvider>
      <TestComponent />
    </OverlayProvider>
  </RouterWrappedComponent>
);

describe("<OverlayProvider />", () => {
  beforeEach(() => {
    render(testComponent);
  });

  test("setChildFormId()", async () => {
    const button = screen.getByRole("button", { name: "setChildFormId" });
    const text = `Child Form ${mockChildFormId}`;
    expect(screen.queryByText(text)).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByText(text)).toBeVisible();
  });

  test("setSelectedStandard()", async () => {
    const button = screen.getByRole("button", { name: "setSelectedStandard" });
    const text = `${mockSelectedStandard.entity.name} ${mockSelectedStandard.count}`;
    expect(screen.queryByText(text)).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByText(text)).toBeVisible();
  });

  testA11yAct(testComponent);
});
