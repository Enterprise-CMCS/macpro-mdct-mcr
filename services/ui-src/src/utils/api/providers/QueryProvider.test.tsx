import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { QueryProvider } from "./QueryProvider";

const TestComponent = () => <div data-testid="testdiv">Test</div>;

const testComponent = (
  <QueryProvider>
    <TestComponent />
  </QueryProvider>
);

describe("Test QueryProvider renders", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });

  test("QueryProvider renders children", async () => {
    expect(screen.getByTestId("testdiv")).toHaveTextContent("Test");
  });
});
