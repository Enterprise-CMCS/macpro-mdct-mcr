import { useContext } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WarningsContext, WarningsProvider } from "./WarningsContext";

const mockWarnings = {
  fieldA: "This value seems low — is this correct?",
  fieldB: null,
};

const TestComponent = () => {
  const { warnings, setWarnings } = useContext(WarningsContext);
  return (
    <div>
      <div data-testid="warnings-output">{JSON.stringify(warnings)}</div>
      <button onClick={() => setWarnings(mockWarnings)}>Set warnings</button>
      <button onClick={() => setWarnings({ fieldA: "Only field A warning" })}>
        Set partial warnings
      </button>
      <button onClick={() => setWarnings({})}>Clear warnings</button>
    </div>
  );
};

const testComponent = (
  <WarningsProvider>
    <TestComponent />
  </WarningsProvider>
);

describe("<WarningsProvider />", () => {
  describe("Initial state", () => {
    test("WarningsProvider renders children", async () => {
      await act(async () => {
        render(testComponent);
      });
      expect(screen.getByTestId("warnings-output")).toBeVisible();
    });

    test("initial warnings state is empty", async () => {
      await act(async () => {
        render(testComponent);
      });
      expect(screen.getByTestId("warnings-output")).toHaveTextContent("{}");
    });
  });

  describe("setWarnings", () => {
    test("setWarnings updates warnings state correctly", async () => {
      await act(async () => {
        render(testComponent);
      });
      const setButton = screen.getByText("Set warnings");
      await act(async () => {
        await userEvent.click(setButton);
      });
      expect(screen.getByTestId("warnings-output")).toHaveTextContent(
        JSON.stringify(mockWarnings)
      );
    });

    test("setWarnings clears warnings when set to empty object", async () => {
      await act(async () => {
        render(testComponent);
      });
      // first set some warnings
      const setButton = screen.getByText("Set warnings");
      await act(async () => {
        await userEvent.click(setButton);
      });
      // then clear them
      const clearButton = screen.getByText("Clear warnings");
      await act(async () => {
        await userEvent.click(clearButton);
      });
      expect(screen.getByTestId("warnings-output")).toHaveTextContent("{}");
    });

    test("setWarnings replaces all warnings rather than merging", async () => {
      await act(async () => {
        render(testComponent);
      });
      const setButton = screen.getByText("Set warnings");
      await act(async () => {
        await userEvent.click(setButton);
      });
      // now replace with only one field
      const partialButton = screen.getByText("Set partial warnings");
      await act(async () => {
        await userEvent.click(partialButton);
      });
      // fieldB should be gone since setWarnings does full replace
      expect(screen.getByTestId("warnings-output")).toHaveTextContent(
        JSON.stringify({ fieldA: "Only field A warning" })
      );
      expect(screen.getByTestId("warnings-output")).not.toHaveTextContent(
        "fieldB"
      );
    });
  });
});
