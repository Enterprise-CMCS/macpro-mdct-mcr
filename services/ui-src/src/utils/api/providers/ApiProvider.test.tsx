import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { ApiProvider } from "./ApiProvider";

const TestComponent = () => <div data-testid="testdiv">Test</div>;

const testComponent = (
  <ApiProvider>
    <TestComponent />
  </ApiProvider>
);

describe("Test ApiProvider renders", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });

  test("ApiProvider renders children", () => {
    expect(screen.getByTestId("testdiv")).toHaveTextContent("Test");
  });
});
