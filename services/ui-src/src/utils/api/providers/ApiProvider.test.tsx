import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { ApiProvider } from "./ApiProvider";

const TestComponent = () => {
  return <div data-testid="testdiv">Test</div>;
};

const testComponent = (
  <ApiProvider>
    <TestComponent />
  </ApiProvider>
);

describe("Test ApiProvider renders", () => {
  beforeEach(async () => {
    await act(async () => {
      render(testComponent);
    });
  });

  test("ApiProvider renders children", async () => {
    expect(screen.getByTestId("testdiv")).toBeVisible;
  });
});
