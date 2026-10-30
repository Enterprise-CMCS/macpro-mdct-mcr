import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router";
// components
import { ScrollToTopComponent } from "./scrollToTop";

const Navigator = () => {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/second")}>navigate</button>;
};

describe("Test scrollToTop focus on route change", () => {
  const originalRAF = window.requestAnimationFrame;
  const originalCAF = window.cancelAnimationFrame;

  beforeEach(() => {
    // Run the callback synchronously so we can assert on it
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    }) as any;
    window.cancelAnimationFrame = jest.fn();
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRAF;
    window.cancelAnimationFrame = originalCAF;
    jest.restoreAllMocks();
  });

  test("Doesn't run on first render", async () => {
    render(
      <MemoryRouter initialEntries={["/first"]}>
        <ScrollToTopComponent />
        <main id="main-content">
          <h1>Heading</h1>
        </main>
        <Navigator />
      </MemoryRouter>
    );

    const main = document.getElementById("main-content");
    expect(main).not.toHaveAttribute("tabindex");
    expect(document.activeElement).toBe(document.body);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  test("falls back to #main-content when no h1 exists", async () => {
    render(
      <MemoryRouter initialEntries={["/first"]}>
        <ScrollToTopComponent />
        <main id="main-content">Main</main>
        <Navigator />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: "navigate" }));

    const main = document.getElementById("main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(document.activeElement).toBe(main);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test("focus h1 and scrolls to top", async () => {
    render(
      <MemoryRouter initialEntries={["/first"]}>
        <ScrollToTopComponent />
        <h1>Heading</h1>
        <Navigator />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: "navigate" }));

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAttribute("tabindex", "-1");
    expect(document.activeElement).toBe(heading);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
