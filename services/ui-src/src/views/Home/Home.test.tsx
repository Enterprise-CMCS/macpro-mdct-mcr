import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { useApiMock } from "utils/testing/mockApi";
// views
import Home from "./Home";

const queryClient = new QueryClient();

describe("Test Home view", () => {
  beforeEach(() => {
    useApiMock({});
    render(
      <QueryClientProvider client={queryClient}>
        <RouterWrappedComponent>
          <Home />
        </RouterWrappedComponent>
      </QueryClientProvider>
    );
  });

  test("Check that Home view renders", () => {
    expect(screen.getByTestId("home-view")).toBeVisible();
  });
});

describe("Test Home view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <RouterWrappedComponent>
          <Home />
        </RouterWrappedComponent>
      </QueryClientProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
