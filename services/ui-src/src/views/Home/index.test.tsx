import { Home } from "./index";
import { render, screen } from "@testing-library/react";
import { RouterWrappedComp } from "utils/testing";
import { useApiMock } from "utils/testUtils/useApiMock";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

describe("Test Home.tsx", () => {
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
    const homeContainer = screen.getByTestId("Home-Container");
    expect(homeContainer).toBeVisible();
  });
});
