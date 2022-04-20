import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
// utils
import { RouterWrappedComp } from "utils/testing";
import { useApiMock } from "utils/testUtils/useApiMock";
// views
import { Home } from "./Home";

const queryClient = new QueryClient();

describe("Test Home view", () => {
  beforeEach(() => {
    useApiMock({});
    render(
      <QueryClientProvider client={queryClient}>
        <RouterWrappedComp>
          <Home />
        </RouterWrappedComp>
      </QueryClientProvider>
    );
  });

  test("Check that the Home renders", () => {
    expect(screen.getByTestId("home-view")).toBeVisible();
  });
});
